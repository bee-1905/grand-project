const axios = require('axios');

class N8nService {
  async generateRecipe(cuisine, ingredients) {
    // Dummy n8n workflow simulation
    try {
      // In a real implementation, this would call an n8n workflow
      // const response = await axios.post(
      //   process.env.N8N_WORKFLOW_URL,
      //   { cuisine, ingredients },
      //   { headers: { 'X-Api-Key': process.env.N8N_API_KEY } }
      // );
      
      // Dummy response for now
      return {
        title: `Generated ${cuisine} Recipe`,
        ingredients: ingredients.map((ing) => ({ name: ing, quantity: '1 unit' })),
        instructions: 'Mix ingredients and cook according to cuisine style.',
        cuisine,
      };
    } catch (error) {
      throw new Error(`Failed to generate recipe: ${error.message}`);
    }
  }
}

module.exports = new N8nService();