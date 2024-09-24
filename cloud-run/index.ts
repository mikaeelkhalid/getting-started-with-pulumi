import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as random from "@pulumi/random";

// import the provider's configuration settings.
const gcpConfig = new pulumi.Config("gcp");
const location = gcpConfig.require("region");


// generate a unique artifact registry repository id
const uniqueString = new random.RandomString("unique-string", {
    length: 4,
    lower: true,
    upper: false,
    numeric: true,
    special: false,
})

let repoId = uniqueString.result.apply(result => "repo-" + result);

// create an artifact registry repository
const repository = new gcp.artifactregistry.Repository("repository", {
    description: "Repository for container image",
    format: "DOCKER",
    location: location,
    repositoryId: repoId,
});