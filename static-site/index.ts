import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as synced_folder from "@pulumi/synced-folder";


// import the program's configuration settings.
const config = new pulumi.Config();

const indexDocument = config.get("indexDocument") || "index.html";
const errorDocument = config.get("errorDocument") || "error.html";

const path = config.get("path") || "./www";

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

// using a synced folder to manage the files of the website.
const syncedFolder = new synced_folder.GoogleCloudFolder("synced-folder", {
    path: path,
    bucketName: bucket.name,
});