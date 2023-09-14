//const assert = require('assert');
//const { describe } = require('node:test');
//const { Octokit } = require("@octokit/rest");
import { describe, it } from 'mocha';
//import assert from 'assert';
//import { Octokit } from '@octokit/rest'
import github from '@actions/github';
import core from '@actions/core';
//import { Octokit } from 'octokit'
import * as githubGraphQLApi from "../github-graphql-api.mjs";

describe('My Tests', function() {
  it('should pass this test', async function() {

    console.log("TN_PAT: " + process.env.TN_PAT );
    console.log("GITHUB_TOKEN: " + process.env.GITHUB_TOKEN );
    console.log("github object: " + github );

    const myToken = core.getInput('TN_PAT')
    const octokit = github.getOctokit(myToken);

    /* const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    }); */

    const response = await githubGraphQLApi.getProjectV2Data(170, 'TravisNickels', octokit );

    expect(response.user.projectV2.id).to.equal(170);
  });
});