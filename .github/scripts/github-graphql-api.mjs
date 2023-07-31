/* module.exports = {
  helloworld: function () {
    console.log("Hello world");
  }
} */

/**
 * 
 * @param {int} projectNumber - The number of the GitHub projectV2 (e.g. 3)
 * @param {string} owner - The owner of the repo
 * @param {context} github - The github context of the running action
 * @returns ProjectV2 field information object based on the graphQL query format.  For example:
 * - {variable}.user.projectV2.id
 * - {variable}.user.projectV2.title
 * - {variable}.user.projectV2.fields.nodes[array].name
 * - {variable}.user.projectV2.fields.nodes[array].id
 * - {variable}.user.projectV2.fields.nodes[array].options[array].name
 * - {variable}.user.projectV2.fields.nodes[array].options[array].id
 */
export const getProjectV2Data = async (projectNumber, owner, github) => {
  const query = `query($owner: String!, $projectNumber: Int!){
    user(login:$owner) {
      projectV2(number:$projectNumber) {
        id
        title
        fields(first: 100){
          nodes {
            ... on ProjectV2Field {
              name
              id
            }
            ... on ProjectV2SingleSelectField {
              name
              id
              options{
                name
                id
              }
            }
          }
        }
      }
    }
  }`;
  const variables = {
    owner: owner,
    projectNumber: projectNumber,
  };

  return await github.graphql(query, variables);
}