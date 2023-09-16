import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { Octokit } from '@octokit/rest';
import * as githubGraphQLApi from "../github-graphql-api.mjs";

//import assert from 'assert';
//import github from '@actions/github';
//import * as github from '@actions/github';
//import core from '@actions/core';
//import { createTokenAuth } from '@octokit/auth-token';

describe('My Tests', function() {
  before(() => {
    // Set up Fetchmock to intercept Github API requests
    fetchMock.post('https://api.github.com/graphql', {
      body: {
        data: {
          user: {
            projectV2: {
              id: 'PVT_UyhstYisiOxQ8yTr',
              //description: 'Testing',
            }
          },
        },
      },
      headers: { 'content-type': 'application/json' },
    });
  })
  it('should pass this test', async function() {

    //const auth = createTokenAuth(process.env.TN_PAT);
    //const { token } = await auth();
    //const octokit = new Octokit({ auth: token });
    //const myToken = process.env.TN_PAT;
    //const octokit = github.getOctokit(myToken);
    //const octokit = new Octokit(myToken);

    const octokit = new Octokit({
      auth: process.env.TN_PAT,
    });

    const response = await githubGraphQLApi.getProjectV2Data(170, 'TravisNickels', octokit );

    console.log("Query: " + githubGraphQLApi.getProjectV2Data.query);
    console.log("response.user.projectV2.id: " + response.user.projectV2.id);
    expect(response.user.projectV2.id).to.equal('PVT_UyhstYisiOxQ8yTr');
    expect(response).to.deep.equal({ user: { projectV2: { id: "PVT_UyhstYisiOxQ8yTr"}}});
  });
});