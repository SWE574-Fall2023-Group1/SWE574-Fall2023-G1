import requests
from .models import Story, StoryRecommendation
from django.db.models import Q
from datetime import datetime, timedelta
import logging
from django.contrib.gis.geos import Point, LineString, Polygon, GEOSGeometry
from django.contrib.gis.db.models.functions import Distance
from django.db.models import Q
from bs4 import BeautifulSoup
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk import pos_tag
from collections import Counter
from nltk.stem import WordNetLemmatizer

logger = logging.getLogger(__name__)

def update_recommendations(user):
    logger.warning(f"Updating recommendations for user: {user.username}")

    liked_stories = Story.objects.filter(likes=user)
    recommended_tags = set()

    # Gather related tags
    for story in liked_stories:
        for tag in story.story_tags.all():
            related_tags = query_related_tags(tag.wikidata_id)
            recommended_tags.update(related_tags)

    all_stories = Story.objects.exclude(author=user)

    for story in all_stories:
        tag_relation = is_tag_related(story, liked_stories, recommended_tags)

        for liked_story in liked_stories:
            location_relation = is_location_related(liked_story, story)
            time_relation = is_time_related(liked_story, story)
            content_relation = compare_keywords(liked_story, story)

            recommendation, created = StoryRecommendation.objects.get_or_create(
                user=user,
                story=story
            )

            # Calculate recommendation points
            recommendation_points = 0

            if not created:
                if not recommendation.tag_related and tag_relation:
                    recommendation.tag_related = True
                if not recommendation.location_related and location_relation:
                    recommendation.location_related = True
                if not recommendation.time_related and time_relation:
                    recommendation.time_related = True
                if recommendation.content_related < content_relation:
                    recommendation.content_related = content_relation

            if tag_relation:
                recommendation_points += 2
            if location_relation:
                recommendation_points += 1
            if time_relation:
                recommendation_points += 0.5
            recommendation_points += content_relation * 0.5

            # Update recommendation points
            recommendation.points = recommendation_points

            recommendation.related_stories.add(liked_story)
            recommendation.save()



def query_related_tags(wikidata_id):
    # SPARQL query to find related tags (instances or subclasses)
    query = """
        SELECT ?relatedTag WHERE {
            {
                ?relatedTag wdt:P279* wd:%s .  # Subclasses of the item
            } UNION {
                wd:%s wdt:P279* ?relatedTag .  # Superclasses of the item
            }
        }""" % (wikidata_id, wikidata_id)  # Consider parameterizing this if possible

    url = "https://query.wikidata.org/sparql"

    try:
        response = requests.get(url, params={'query': query, 'format': 'json'})
        response.raise_for_status()
        data = response.json()

        if 'bindings' in data['results']:
            # Extract related tags from the response
            related_tags = [result['relatedTag']['value'].split('/')[-1] for result in data['results']['bindings']]
            logger.warning(f"Related tags for {wikidata_id}: {related_tags}")
            return related_tags
        else:
            logger.warning(f"No related tags found for {wikidata_id}")
            return []
    except requests.RequestException as e:
        logger.error(f"Error querying Wikidata: {e}")
        return []


def is_tag_related(recommended_story, liked_stories, recommended_tags):
    # Check if the recommended story has any tag that's in the recommended_tags set
    return recommended_story.story_tags.filter(wikidata_id__in=recommended_tags).exists()


def is_location_related(story1, story2, radius_diff=5):
    # Assuming radius_diff is in kilometers
    radius_diff_meters = radius_diff * 1000  # Convert to meters
    utm_srid = 32633  # Example: UTM zone 33N SRID

    def create_buffer_for_location(location):


        if location.point:
            buffer_area = location.point.buffer(radius_diff_meters)
        elif location.line :
            buffer_area = location.line.buffer(radius_diff_meters)
        elif location.polygon :
            buffer_area = location.polygon  # No buffer needed for a polygon
        elif location.circle:
            circle_center = GEOSGeometry(location.circle, srid=4326)
            circle_center.transform(utm_srid)
            buffer_area = circle_center.buffer(location.radius)
            buffer_area.transform(4326)
        else:
            buffer_area = None
        return buffer_area

    for loc1 in story1.location_ids.all():

        buffer1 = create_buffer_for_location(loc1)
        if buffer1:
            for loc2 in story2.location_ids.all():
                buffer2 = create_buffer_for_location(loc2)
                if buffer2 and buffer1.intersects(buffer2):
                    return True
    return False

def is_time_related(story1, story2, date_diff=timedelta(days=2)):
    # Logic adapted from your SearchStoryView
    def build_time_query(story, date_diff):
        query_filter = Q()
        time_type = story.date_type

        if story.season_name:
            season_name = story.season_name
            query_filter &= Q(season_name__icontains=season_name)

        if time_type == 'year':
            year_value = story.year
            query_filter &= (Q(date__year__exact=year_value) |
                            Q(start_date__year__exact=year_value) |
                            Q(end_date__year__exact=year_value))

        elif time_type == 'year_interval':
            start_year = story.start_year
            end_year = story.end_year
            query_filter &= (Q(start_year__gte=start_year, end_year__lte=end_year) |
                            Q(year__range=(start_year, end_year)) |
                            Q(date__year__range=(start_year, end_year)))
        elif time_type == 'normal_date':
            if isinstance(story.date, datetime):
                given_date = story.date
            else:
                # If it's a string, parse it into a datetime object
                given_date = datetime.strptime(story.date, "%Y-%m-%d")
            start_date = given_date - timedelta(days=date_diff)
            end_date = given_date + timedelta(days=date_diff)
            query_filter &= Q(date__range=(start_date, end_date))
        elif time_type == 'interval_date':
            if isinstance(story.start_date, datetime):
                start_date = story.start_date
            else:
                # If it's a string, parse it into a datetime object.
                start_date = datetime.strptime(story.start_date, "%Y-%m-%d")

            # Check if 'story.end_date' is a datetime object, and use it directly if so.
            if isinstance(story.end_date, datetime):
                end_date = story.end_date
            else:
                # If it's a string, parse it into a datetime object.
                end_date = datetime.strptime(story.end_date, "%Y-%m-%d")

            query_filter &= Q(start_date__gte=start_date, end_date__lte=end_date)
        elif time_type == 'decade':
            decade_value = story.decade
            start_year = decade_value
            end_year = decade_value + 9
            query_filter &= (Q(decade__exact=decade_value) |
                            Q(year__range=(start_year, end_year)) |
                            Q(date__year__range=(start_year, end_year)) |
                            Q(start_date__year__range=(start_year, end_year)) |
                            Q(end_date__year__range=(start_year, end_year)))

        return query_filter

    time_query = build_time_query(story1,2)

    return Story.objects.filter(time_query).filter(id=story2.id).exists()


def compare_keywords(story1, story2):
    keywords1 = set(extract_keywords_enhanced(story1.content))
    keywords2 = set(extract_keywords_enhanced(story2.content))
    return len(keywords1.intersection(keywords2))

def extract_keywords_enhanced(html_content, max_words=5):
    # Extract text from HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    text = soup.get_text()

    # Tokenize, remove stop words, and get POS tags
    stop_words = set(stopwords.words('english'))
    words = [word for word in word_tokenize(text) if word.isalpha() and word not in stop_words]
    pos_tags = pos_tag(words)

    # Initialize lemmatizer
    lemmatizer = WordNetLemmatizer()

    # Lemmatize words, focus on nouns and adjectives, and exclude proper nouns
    lemmatized_words = [lemmatizer.lemmatize(word.lower(), pos='n') for word, tag in pos_tags
                        if tag.startswith(('NN', 'JJ')) and not tag.startswith('NNP')]

    # Get the most common words
    common_words = Counter(lemmatized_words).most_common(max_words)
    return [word for word, freq in common_words]
