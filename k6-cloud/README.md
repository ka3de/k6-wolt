### Run

To run tests in the cloud, run scripts through command:
```
K6_CLOUD_PROJECT_ID=<projectID> k6 cloud ./scripts/<script>.js
```

To run tests in your local machine and output results to the cloud:
```
K6_CLOUD_PROJECT_ID=<projectID> k6 run -o ./scripts/<script>.js
```

**Note:** If no project is specified, test will run in your organization's default project.
