# TF-Automation

## Authentication

Before running GitHub CLI commands, you must authenticate by running `gh auth login --scopes "project"`. If you only need to read, but not edit, projects, you can provide the `read:project` scope instead of `project`. For more information on command line authentication, see "[gh auth login](https://cli.github.com/manual/gh_auth_login)."

## legacy_global_id / next_global_id

legacy_global_id is is now deprecated, which typically looks like this `MDQ6VXNlcjM0MDczMDM=`.  There is now a next_global_id that is being used that has a format like `PVT_kwHOBTAVOs4ANTT3`. By adding another header to the API call the new `next_global_id` can be retrieved.

##### Powershell

Instead of doing this command to get the `node_id` of an authenticated user

```graphql
gh api -H "Accept: application/vnd.github+json" /users/{username}
```

##### Result

```json
{
  "node_id": "MDQ6VXNlcjg3MDM3MjQy"
}
```

Add this to the API call to get the new next_global_id `node_id`

```graphql
gh api -H "Accept: application/vnd.github+json" -H "X-Github-Next-Global-ID: 1" /users/{username}
```
```json
{
  "node_id": "U_kgDOBTAVOg"
}
```

## Creating projects
To create a new project using the API, you'll need to provide a name for the project and the node ID of a GitHub user or organization who will become the project's owner.

You can find the node ID of a GitHub user or organization if you know the username. Replace `GITHUB_OWNER` with the GitHub username of the new project owner.
To create the project, replace OWNER_ID with the node ID of the new project owner and replace PROJECT_NAME with a name for the project.

To create the project, replace `OWNER_ID` with the `node_id` of the new project owner using the new `next_global_id` and replace `PROJECT_NAME` with a name for the project.

##### Powershell
When using powershell and doing a query or mutation make sure to escape the quotation marks `"` using a a backslash `\` when indicating a String. 
```graphql
gh api graphql -H "X-Github-Next-Global-ID: 1" -f query='mutation{createProjectV2(input:{ownerId:\"U_kgDOBTAVOg\",title:\"TF-Project\"}){projectV2{id}}}'
```
##### Result
```json
{
  "data": {
    "createProjectV2": {
      "projectV2": {
        "id": "PVT_kwHOBTAVOs4ANThR"
      }
    }
  }
}
```

## Get node_id for project

##### Powershell
```graphql
gh api graphql -H "X-Github-Next-Global-ID: 1" --raw-field query='query{ user(login:\"{username}\") { projectV2(number: 11) { id } } }'
```
##### Result
```json
{
  "data": {
    "user": {
      "projectV2": {
        "id": "PVT_kwHOBTAVOs4ANTT3"
      }
    }
  }
}
```


## Links
- https://devopsjournal.io/blog/2022/11/28/github-graphql-queries
- https://github.com/community/community/discussions/39777
