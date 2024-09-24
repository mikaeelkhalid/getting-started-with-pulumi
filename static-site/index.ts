import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";


// import the program's configuration settings.
const config = new pulumi.Config();

const indexDocument = config.get("indexDocument") || "index.html";
const errorDocument = config.get("errorDocument") || "error.html";

// create a storage bucket and configure it as a website.
const bucket = new gcp.storage.Bucket("bucket", {
    location: "US",
    website: {
        mainPageSuffix: indexDocument,
        notFoundPage: errorDocument,
    },
});

// create an iam binding to allow public read access to the bucket.
const bucketIamBinding = new gcp.storage.BucketIAMBinding("bucket-iam-binding", {
    bucket: bucket.name,
    role: "roles/storage.objectViewer",
    members: ["allUsers"],
});