/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([
      "systems/quickquest/templates/partials/character-attribute.html",
      "systems/quickquest/templates/partials/character-archetype.html"
    ]);
  };
  