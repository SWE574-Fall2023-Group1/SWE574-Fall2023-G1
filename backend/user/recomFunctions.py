import requests
from .models import Story, StoryRecommendation

import logging

logger = logging.getLogger(__name__)

def update_recommendations(user):
    logger.warning(f"Updating recommendations for user: {user.username}")

    liked_stories = Story.objects.filter(likes=user)
    recommended_tags = set()

    for story in liked_stories:
        for tag in story.story_tags.all():
            logger.warning(f"Processing tag: {tag.name} for story: {story.title}")
            logger.warning(f"Processing tag Wikidata: {tag.wikidata_id} for story: {story.title}")
            related_tags = query_related_tags(tag.wikidata_id)
            logger.warning(f"Processing tag Realted: {related_tags} for story: {story.title}")
            recommended_tags.update(related_tags)

    logger.warning(f"Recommended tags: {recommended_tags}")

    recommended_stories = Story.objects.filter(story_tags__wikidata_id__in=recommended_tags).distinct()

    logger.warning(f"Found {len(recommended_stories)} recommended stories")

    for story in recommended_stories:
        _, created = StoryRecommendation.objects.get_or_create(user=user, story=story)
        if created:
            logger.warning(f"Created new recommendation for story: {story.title}")



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
