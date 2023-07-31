/* module.exports = {
  helloworld: function () {
    console.log("Hello world");
  }
} */

/* export default function myfunction() {
  return 'Hello world';
} */

export const func1 = () => {
  return 'func1';
}

export const func2 = () => {
  return 'func2';
}

export const func3 = async (projectNumber, owner) => {
  const query = `query($owner: String!, $projectNum: Int!){
    user(login:$owner) {
      projectV2(number:$projectNum) {
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
    projectNum: projectNumber,
  };

  return await github.graphql(query, variables);
}