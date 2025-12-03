# Blueprint YAML Reference

Every [Render Blueprint](infrastructure-as-code) is backed by a YAML file that defines a set of interconnected services, databases, and environment groups.

A Blueprint file _must_ be named `render.yaml`, and it _must_ be located in the root directory of a Git repository.

This reference page provides an [example Blueprint file](#example-blueprint-file), along with documentation for supported fields.

## Example Blueprint file

The following `render.yaml` file demonstrates usage for _most_ supported fields. These fields are documented in further detail below.

*Show example Blueprint file*

```yaml:render.yaml
#################################################################
# Example render.yaml                                           #
# Do not use this file directly! Consult it for reference only. #
#################################################################

previews:
  generation: automatic # Enable preview environments

# List services *except* Render Postgres databases here
services:
  # A web service on the Ruby native runtime
  - type: web
    runtime: ruby
    name: sinatra-app
    repo: https://github.com/render-examples/sinatra # Default: Repo containing render.yaml
    numInstances: 3 # Manual scaling configuration. Default: 1 for new services
    region: frankfurt # Default: oregon
    plan: standard # Default: starter
    branch: prod # Default: master
    buildCommand: bundle install
    preDeployCommand: bundle exec ruby migrate.rb
    startCommand: bundle exec ruby main.rb
    autoDeployTrigger: 'off' # Disable automatic deploys
    maxShutdownDelaySeconds: 120 # Increase graceful shutdown period. Default: 30, Max: 300
    domains: # Custom domains
      - example.com
      - www.example.org
    envVars: # Environment variables
      - key: API_BASE_URL
        value: https://api.example.com # Hardcoded value
      - key: APP_SECRET
        generateValue: true # Generate a base64-encoded 256-bit value
      - key: STRIPE_API_KEY
        sync: false # Prompt for a value in the Render Dashboard
      - key: DATABASE_URL
        fromDatabase: # Reference a property of a database (see available properties below)
          name: mydatabase
          property: connectionString
      - key: MINIO_PASSWORD
        fromService: # Reference a value from another service
          name: minio
          type: pserv
          envVarKey: MINIO_ROOT_PASSWORD
      - fromGroup: my-env-group # Add all variables from an environment group
    ipAllowList: # Optional (defaults to allow all); Enterprise workspaces only
      - source: 203.0.113.4/30
        description: office
      - source: 198.51.100.1
        description: home

  # A web service that builds from a Dockerfile
  - type: web
    runtime: docker
    name: webdis
    repo: https://github.com/render-examples/webdis.git # Default: Repo containing render.yaml
    rootDir: webdis # Default: Repo root
    dockerCommand: ./webdis.sh # Default: Dockerfile CMD
    scaling: # Autoscaling configuration
      minInstances: 1
      maxInstances: 3
      targetMemoryPercent: 60 # Optional if targetCPUPercent is set
      targetCPUPercent: 60 # Optional if targetMemory is set
    healthCheckPath: /
    registryCredential: # Default: No credential
      fromRegistryCreds:
        name: my-credentials
    envVars:
      - key: REDIS_HOST
        fromService: # Reference a property from another service (see available properties below)
          type: keyvalue
          name: lightning
          property: host
      - key: REDIS_PORT
        fromService:
          type: keyvalue
          name: lightning
          property: port
      - fromGroup: conc-settings

  # A private service with an attached persistent disk
  - type: pserv
    runtime: docker
    name: minio
    repo: https://github.com/render-examples/minio.git # Default: Repo containing render.yaml
    envVars:
      - key: MINIO_ROOT_PASSWORD
        generateValue: true # Generate a base64-encoded 256-bit value
      - key: MINIO_ROOT_USER
        sync: false # Prompt for a value in the Render Dashboard
      - key: PORT
        value: 10000
    disk: # Persistent disk configuration
      name: data
      mountPath: /data
      sizeGB: 10 # optional

  # A Python cron job that runs every hour
  - type: cron
    name: date
    runtime: python
    schedule: '0 * * * *'
    buildCommand: 'true' # ensure it's a string
    startCommand: date
    repo: https://github.com/render-examples/docker.git # optional

  # A Dockerfile-based background worker
  - type: worker
    name: queue
    runtime: docker
    dockerfilePath: ./sub/Dockerfile # Optional
    dockerContext: ./sub/src # Optional
    branch: queue # Optional

  # A static site
  - type: web
    name: my-blog
    runtime: static
    buildCommand: yarn build
    staticPublishPath: ./build
    previews:
      generation: automatic # Enable service previews
    buildFilter:
      paths:
        - src/**/*.js
      ignoredPaths:
        - src/**/*.test.js
    headers:
      - path: /*
        name: X-Frame-Options
        value: sameorigin
    routes:
      - type: redirect
        source: /old
        destination: /new
      - type: rewrite
        source: /a/*
        destination: /a
    ipAllowList: # Optional (defaults to allow all); Enterprise workspaces only
      - source: 203.0.113.4/30
        description: office
      - source: 198.51.100.1
        description: home

  # A Key Value instance
  - type: keyvalue
    name: lightning
    ipAllowList: # Required
      - source: 0.0.0.0/0
        description: everywhere
    plan: free # Default: starter
    maxmemoryPolicy: noeviction # Default: allkeys-lru

# List Render Postgres databases here
databases:
  # A database with one read replica
  - name: elephant
    databaseName: mydb # Optional (Render may add a suffix)
    user: adrian # Optional
    ipAllowList: # Optional (defaults to allow all)
      - source: 203.0.113.4/30
        description: office
      - source: 198.51.100.1
        description: home
    readReplicas:
      - name: elephant-replica

  # A database that allows only private network connections
  - name: private database
    databaseName: private
    ipAllowList: [] # No entries in the IP allow list

  # A database with specified disk size
  - name: pachyderm
    plan: basic-1gb
    diskSizeGB: 35

  # A database that enables high availability
  - name: highly available database
    plan: pro-8gb
    highAvailability:
      enabled: true

# Environment groups
envVarGroups:
  - name: conc-settings
    envVars:
      - key: CONCURRENCY
        value: 2
      - key: SECRET
        generateValue: true
  - name: stripe
    envVars:
      - key: STRIPE_API_URL
        value: https://api.stripe.com/v2
```

## IDE validation

The Render Blueprint specification is served from [SchemaStore.org](https://www.schemastore.org/json/), which many popular IDEs use to provide live validation and autocompletion for JSON and YAML files.

For VS Code, install the [YAML extension by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) to enable validation of `render.yaml` files:

[img]

If your IDE _doesn't_ integrate with SchemaStore.org, the Blueprint specification is also hosted at `https://render.com/schema/render.yaml.json` in JSON Schema format. Consult your IDE's documentation to learn how to use this schema for validation.

## Root-level fields

The following fields are valid at the root level of a `render.yaml` file:

| Field | Description |
|--------|--------|
| `services` | A list of _non-Postgres_ services to manage with the Blueprint. Each entry is an object that represents a single service. See all [service fields](#service-fields). Services in this top-level list keep their currently assigned environment (if any) after each sync. - To move a service into a specific environment, instead define it in the `services` list for that [environment](#environment-fields). - To remove a service from its current environment, instead define it under the [`ungrouped`](#ungrouped) field. **Do not define the same service in more than one location.** |
| `databases` | A list of Postgres databases to manage with the Blueprint. Each entry is an object that represents a single database. See all [database fields](#database-fields). Databases in this top-level list keep their currently assigned environment (if any) after each sync. - To move a database into a specific environment, instead define it in the `databases` list for that [environment](#environment-fields). - To remove a database from its current environment, instead define it under the [`ungrouped`](#ungrouped) field. **Do not define the same database in more than one location.** |
| `envVarGroups` | A list of [environment groups](configure-environment-variables#environment-groups) to manage with the Blueprint. Each entry is an object that represents a single environment group. See [supported fields](#environment-groups). Environment groups in this top-level list keep their currently assigned environment (if any) after each sync. - To move an environment group into a specific environment, instead define it in the `envVarGroups` list for that [environment](#environment-fields). - To remove an environment group from its current environment, instead define it under the [`ungrouped`](#ungrouped) field. **Do not define the same environment group in more than one location.** |
| `projects` | A list of [projects](projects) to manage with the Blueprint. A project defines one or more `environments`, each of which lists the services and environment groups that belong to it. For details, see [Projects and environments](#projects-and-environments). |
| `ungrouped` | An object for defining resources that should not belong to any [environment](#projects-and-environments). Can contain optional fields `services`, `databases`, and `envVarGroups`, each of which matches the format of its root-level counterpart. `ungrouped:   services:     - type: web       name: my-service       #...` Moving a resource definition into this object removes it from its current [environment](#projects-and-environments), guaranteeing that it is "ungrouped". In contrast, root-level definitions keep their currently assigned environment (if any). **Do not define the same resource in more than one location.** |
| `previews.generation` | The generation mode to use for [preview environments](preview-environments). `previews:   generation: manual` Supported values include: - `off` - `manual` - `automatic` For details on each, see [Manual vs. automatic preview environments](preview-environments#manual-vs-automatic-preview-environments). If you omit this field, preview environments are disabled for any linked Blueprints. Setting the deprecated field `previewsEnabled: true` is equivalent to setting this field to `automatic`. This field does not affect configuration for individual [service previews](service-previews). |
| `previews.expireAfterDays` | The number of days to retain a [preview environment](preview-environments) that receives no updates. After this period, Render automatically deprovisions the preview environment to help reduce your compute costs. By default, preview environments are retained indefinitely until their associated pull request is closed. For details, see [Automatic expiration](preview-environments#automatic-expiration). |

## Service fields

Each entry in a Blueprint file's `services` list is an object that represents a single, _non-Postgres_ service. (You define Postgres databases in the [`databases` list](#database-fields).)

See below for supported fields.

### Essential fields

These fields pertain to a service's core configuration (name, runtime, region, and so on).

| Field | Description |
|--------|--------|
| `name` | **Required.** The service's name. Provide a unique name for each service in your Blueprint file. If you add the name of an _existing_ service to your Blueprint file, Render attempts to apply the Blueprint's configuration to that existing service. |
| `type` | **Required.** The type of service. One of the following: - `web` for a [web service](web-services) _or_ [static site](static-sites) - For a static site, you also set [`runtime: static`](#runtime). - `pserv` for a [private service](private-services) - `worker` for a [background worker](background-workers) - `cron` for a [cron job](cronjobs) - `keyvalue` for a [Render Key Value instance](key-value) - `redis` is a deprecated alias for `keyvalue`. You can't modify this value after creation. You define Render Postgres databases separately, in the [`databases`](#database-fields) list. |
| `runtime` | **Required** unless [`type`](#type) is `keyvalue` or `redis`. The service's runtime. Supported values include: **Native language runtimes** - `node` - `python` - `elixir` - `go` - `ruby` - `rust` **Special-case runtimes** - `docker` for services that [build an image](docker#building-from-a-dockerfile) from a Dockerfile. - `image` for services that [pull a prebuilt image](deploying-an-image) from a registry. - `static` for [static sites](static-sites) You can't modify this value after creation. This field replaces the `env` field (`env` is still supported but is discouraged). |
| `plan` | The service's instance type ([see pricing](pricing#services)). One of the following: - `free` (not available for private services, background workers, or cron jobs) - `starter` - `standard` - `pro` - `pro plus` The following additional instance types are available for [web services](web-services), [private services](private-services), and [background workers](background-workers): - `pro max` - `pro ultra` **If you omit this field:** - Render uses `starter` for a new service. - Render retains the current instance type for an existing service. |
| `previews.generation` | The preview generation mode to use for this service's [pull request previews](service-previews). Supported values include: - `manual` - `automatic` For details on each, see [Manual vs. automatic PR previews](service-previews#manual-vs-automatic-pr-previews). If you omit this field, pull request previews are disabled for the service. Setting the deprecated field `pullRequestPreviewsEnabled: true` is equivalent to setting this field to `automatic`. This field does not affect configuration for [preview environments](preview-environments). |
| `previews.numInstances` | The number of instances to use for this service in [preview environments](preview-environments). If you omit this field, preview instances use the same number of instances as the base service. If the base service uses autoscaling, preview instances use the minimum number of instances for the base service. |
| `previews.plan` | The instance type to use for this service in [preview environments](preview-environments). If you omit this field, preview instances use the same instance type as the base service. |
| `buildCommand` | **Required** for non-Docker-based services. The command that Render runs to [build your service](deploys#build-command). Basic examples include: - `npm install` (Node.js) - `pip install -r requirements.txt` (Python) |
| `startCommand` | **Required** for non-Docker-based services. The command that Render runs to [start your service](deploys#start-command). Basic examples include: - `npm start` (Node.js) - `gunicorn your_application.wsgi` (Python) Docker-based services set the optional [`dockerCommand`](#dockercommand) field instead of this field. |
| `schedule` | **Required** for [cron jobs](cronjobs), omit otherwise. The schedule for running the cron job, as a [cron expression](cronjobs#setup). |
| `preDeployCommand` | If specified, this command runs _after_ the service’s [`buildCommand`](#buildcommand) but _before_ its [`startCommand`](#startcommand). Recommended for running database migrations and other pre-deploy tasks. Learn more about the [pre-deploy command](deploys#pre-deploy-command). |
| `region` | The [region](regions) to deploy the service to. One of the following: - `oregon` (default) - `ohio` - `virginia` - `frankfurt` - `singapore` You can't modify this value after creation. This field does not apply to [static sites](static-sites). If omitted, the default value is `oregon`. |
| `repo` | For Git-based services, the URL of the GitHub/GitLab repo to use. Your Git provider account must have access to the repo. If omitted, Render uses the repo that contains the `render.yaml` file itself. For services that pull a prebuilt Docker image, set [`image`](#image) instead of this field. |
| `branch` | For Git-based services, the branch of the linked [`repo`](#repo) to use. If omitted, Render uses the repo's default branch. **If you're using [preview environments](preview-environments), you probably _don't_ want to set this field.** If you _do_ set it, Render uses the specified branch in all preview environments, _instead of_ your pull request's associated branch. This prevents you from testing code changes in the preview environment. |
| `autoDeployTrigger` | Sets the [automatic deploy](deploys#configuring-auto-deploys) behavior for a Git-based service. This field replaces the deprecated `autoDeploy` field. If you include both, this field takes precedence. One of the following: - `commit`: Trigger a deploy on each commit to the service's linked branch. - Equivalent to the deprecated setting `autoDeploy: true` - `checksPass`: Trigger a deploy only if the linked branch's CI checks pass. - `off`: Disable auto-deploys. - Equivalent to the deprecated setting `autoDeploy: false` This field has no effect for services that [deploy a prebuilt Docker image](deploying-an-image). **If you omit this field:** - Render uses `commit` for a new service. - Render retains the current value for an existing service. |
| `domains` | [Web services](web-services) and [static sites](static-sites) only. A list of [custom domains](custom-domains) for the service. Internet-accessible services are always reachable at their `.onrender.com` subdomain. For each root domain in the list, Render automatically adds a `www.` subdomain that redirects to the root domain. For each `www.` subdomain in the list, Render automatically adds the corresponding root domain and redirects it to the `www.` subdomain. |
| `healthCheckPath` | [Web services](web-services) only. The path of the service's [health check endpoint](health-checks) for zero-downtime deploys. |
| `maxShutdownDelaySeconds` | [Web services](web-services), [private services](private-services), and [background workers](background-workers) only. The maximum amount of time (in seconds) that Render waits for your application process to exit gracefully after sending it a `SIGTERM` signal. For details, see [Zero-downtime deploys](deploys#zero-downtime-deploys). After this delay, Render terminates the process with a `SIGKILL` signal if it's still running. Render most commonly shuts down instances as part of redeploying your service or scaling it down. Set this field to give instances more time to finish any existing work before termination. This value must be an integer between `1` and `300`, inclusive. If omitted, the default value is `30`. |

### Docker

The following fields are specific to [Docker-based services](docker). This includes both services that build an image with a `Dockerfile` ([`runtime: docker`](#runtime)) and services that pull a prebuilt image from a registry ([`runtime: image`](#runtime)).

#### Building from a `Dockerfile`

| Field | Description |
|--------|--------|
| `dockerCommand` | The command to run when starting the Docker-based service. If omitted, Render uses the `CMD` defined in the `Dockerfile`. |
| `dockerfilePath` | The path to the service's `Dockerfile`, relative to the repo root. Typically used for services in a [monorepo](monorepo-support). If omitted, Render uses `./Dockerfile`. |
| `dockerContext` | The path to the service's Docker build context, relative to the repo root. Typically used for services in a [monorepo](monorepo-support). If omitted, Render uses the repo root. |
| `registryCredential` | If your `Dockerfile` references any private images, you must specify a valid credential that can access those images. This field uses the following format: `registryCredential:   fromRegistryCreds:     name: my-credentials # The name of a credential you've added to your workspace` Add registry credentials in the [Render Dashboard][dboard] from your Workspace Settings page, or via the [Render API](https://api-docs.render.com/reference/create-registry-credential). |

#### Pulling a prebuilt image

| Field | Description |
|--------|--------|
| `image` | Details for the Docker image to pull from a registry. This field uses the following format: `image:   url: docker.io/my-name/my-image:latest   creds: # Only for private images     fromRegistryCreds:       name: my-credential-name # The name of a credential you've added to your workspace` Provide `creds` only if you're pulling a private image. Add registry credentials in the [Render Dashboard][dboard] from your Workspace Settings page, or via the [Render API](https://api-docs.render.com/reference/create-registry-credential). For more information, see [Deploy a Prebuilt Docker Image](deploying-an-image). |

### Scaling

> **Note the following about [**scaling**](scaling):**
>
> - You can't scale a service with an attached [persistent disk](disks).
> - Autoscaling requires a [**Professional** workspace](professional-features) or higher.
>   - Manual scaling is available for all workspaces.
> - If you add an existing service to a Blueprint, that service retains any existing autoscaling settings unless you add the [`scaling`](#scaling) field in your Blueprint.
> - Autoscaling is disabled in [preview environments](preview-environments).
>   - Instead, autoscaled services always run a number of instances equal to their [`minInstances`](#scaling-1).

| Field | Description |
|--------|--------|
| `numInstances` | For a [manually scaled](scaling#manual-scaling) service, the number of instances to scale the service to. **If you omit this field:** - Render uses `1` for a new service. - Render retains the current value for an existing service. **This value has no effect for services with autoscaling enabled.** Configure autoscaling behavior with the [`scaling`](#scaling-1) field. |
| `scaling` | For an [autoscaled](scaling#autoscaling) service, configuration details for the service's autoscaling behavior. Example: `scaling:   minInstances: 1 # Required   maxInstances: 3 # Required   targetMemoryPercent: 60 # Optional if targetCPUPercent is set (valid: 1-90)   targetCPUPercent: 60 # Optional if targetMemory is set (valid: 1-90)` |

### Build

| Field | Description |
|--------|--------|
| `buildFilter` | File paths in the service's repo to include or ignore when determining whether to trigger an automatic build. Especially useful for [monorepos](monorepo-support#setting-build-filters). Build filter paths use [glob syntax](monorepo-support#filter-syntax). They are always relative to the repo's root directory. When synced, this value _fully replaces_ an existing service's build filter settings. If you _omit_ this field for a service with existing build filter settings, Render _replaces_ those settings with empty lists. `buildFilter:   paths: # Only trigger a build with changes to these files     - src/**/*.js   ignoredPaths: # Ignore these files, even if they match a path in 'paths'     - src/**/*.test.js` |
| `rootDir` | The service's root directory within its repo. Changes to files _outside_ the root directory do not trigger a build for the service. Set this when working in a [monorepo](monorepo-support#setting-a-root-directory). If omitted, Render uses the repo's root directory. |

### Disks

Attach a [persistent disk](disks) to a compatible service with the `disk` field:

```yaml
disk:
  name: app-data # Required field
  mountPath: /opt/data # Required field
  sizeGB: 5 # Default: 10
```

You can modify the `name` and `mountPath` of an existing disk. You can _increase_ the `sizeGB` of an existing disk, but you can't reduce it.

### Static sites

The following fields are specific to [static sites](static-sites):

| Field | Description |
|--------|--------|
| `staticPublishPath` | **Required.** The path to the directory that contains the static files to publish, relative to the repo root. Common examples include `./build` and `./dist`. |
| `headers` | Configuration details for a static site's [HTTP response headers](static-site-headers). Example: `headers:   # Adds X-Frame-Options: sameorigin to all site paths   - path: /*     name: X-Frame-Options     value: sameorigin   # Adds Cache-Control: must-revalidate to /blog paths   - path: /blog/*     name: Cache-Control     value: must-revalidate` You can modify existing header rules and add new ones. Render _preserves_ any existing header rules that are not included in the Blueprint file. |
| `routes` | Configuration details for a static site's [redirect and rewrite routes](redirects-rewrites). Example: `routes:   # Redirect (HTTP status 301) from /a to /b   - type: redirect     source: /a     destination: /b   # Rewrite all /app/* requests to /app   - type: rewrite     source: /app/*     destination: /app` You can modify existing routing rules and add new ones. Render _preserves_ any existing routing rules that are not included in the Blueprint file. |

### Render Key Value

You define Render Key Value instances in the `services` field of `render.yaml` alongside your other non-Postgres services. A Key Value instance has the [`type`](#type) `keyvalue` (or its deprecated alias `redis`).

#### Example definitions

**Show example Key Value definitions**

```yaml
services:
  # A Key Value instance that defines all available fields
  - type: keyvalue
    name: thunder
    ipAllowList: # Allow external connections from only these CIDR blocks
      - source: 203.0.113.4/30
        description: office
      - source: 198.51.100.1
        description: home
    region: frankfurt # Default: oregon
    plan: pro # Default: starter
    previewPlan: starter # Default: use the value for 'plan'
    maxmemoryPolicy: allkeys-lru # Default: allkeys-lru)

  # A Key Value instance that allows all external connections
  - type: keyvalue
    name: lightning
    ipAllowList: # Allow external connections from everywhere
      - source: 0.0.0.0/0
        description: everywhere

  # A Key Value instance that allows only internal connections
  - type: keyvalue
    name: private cache
    ipAllowList: [] # Only allow internal connections
```

#### Key-Value-specific fields

| Field | Description |
|--------|--------|
| `ipAllowList` | **Required.** See [Data access control](#data-access-control). |
| `maxmemoryPolicy` | The Key Value instance's eviction policy for when it reaches its maximum memory limit. One of the following: - `allkeys-lru` (default) - `volatile-lru` - `allkeys-random` - `volatile-random` - `volatile-ttl` - `noeviction` For details on these policies, see the [Render Key Value documentation](key-value#maxmemory-policy). |

### Environment variables

See [Setting environment variables](#setting-environment-variables).

## Database fields

Each entry in a Blueprint file's `databases` list is an object that represents a Render Postgres instance.

See below for supported fields.

### Example definitions

**Show example database definitions**

```yaml
databases:
  # A basic-4gb database instance with one read replica
  - name: prod # Required
    postgresMajorVersion: '18' # Default: most recent supported version
    region: frankfurt # Default: oregon
    plan: basic-4gb # Default: basic-256mb
    databaseName: prod_app # Default: generated value based on name
    user: app_user # Default: generated value based on name
    ipAllowList: # Default: allows all connections
      - source: 203.0.113.4/30
        description: office
      - source: 198.51.100.1
        description: home
    readReplicas: # Default: does not add any read replicas
      - name: prod-replica

  # A database that allows only private network connections
  - name: private database
    databaseName: private
    ipAllowList: [] # Only allow internal connections

  # A database that enables high availability
  - name: highly available database
    plan: pro-16gb
    highAvailability:
      enabled: true
```

### Essential fields

| Field | Description |
|--------|--------|
| `name` | **Required.** The Postgres instance's name. Provide a unique name for each service in your Blueprint file. If you add the name of an _existing_ instance to your Blueprint file, Render attempts to apply the Blueprint's configuration to that existing instance. You can't modify this value after creation. |
| `plan` | The database's instance type ([see pricing](pricing#postgresql)). One of the following: **View values for plan** **Current instance types:** - `free` - `basic-256mb` - `basic-1gb` - `basic-4gb` - `pro-4gb` - `pro-8gb` - `pro-16gb` - `pro-32gb` - `pro-64gb` - `pro-128gb` - `pro-192gb` - `pro-256gb` - `pro-384gb` - `pro-512gb` - `accelerated-16gb` - `accelerated-32gb` - `accelerated-64gb` - `accelerated-128gb` - `accelerated-256gb` - `accelerated-384gb` - `accelerated-512gb` - `accelerated-768gb` - `accelerated-1024gb` **[**Legacy instance types**](postgresql-legacy-instance-types):** - `starter` - `standard` - `pro` - `pro plus` You cannot create new databases on a [legacy instance type](postgresql-legacy-instance-types). You can move a database from a legacy instance type to a current instance type, but you can't move it back. **If you omit this field:** - Render uses `basic-256mb` for a new database. - Render retains the current instance type for an existing database. |
| `previewPlan` | The instance type to use for this database in [preview environments](preview-environments). If you omit this field, preview instances use the same instance type as the primary database (specified by [`plan`](#plan-1)). 
> If your primary database uses a new [flexible instance type](postgresql-refresh), you cannot specify a _non_-flexible instance type for `previewPlan` (or vice versa).
 |
| `diskSizeGB` | The database's disk size, in GB. Not valid for [legacy instance types](postgresql-legacy-instance-types), which have a fixed disk size. This value must be either `1` or a multiple of `5`. You can increase disk size, but you can't _decrease_ it. **If you omit this field:** - For a new database, Render uses a default disk size based on the instance type's tier: - Free: 1 GB - Basic: 15 GB - Pro: 100 GB - Accelerated: 250 GB - For an existing database, Render retains the current disk size. |
| `previewDiskSizeGB` | The disk size to use for this database in [preview environments](preview-environments). If you omit this field, preview instances use the same disk size as the primary database (specified by [`diskSizeGB`](#disksizegb)). |
| `region` | The [region](regions) to deploy the instance to. One of the following: - `oregon` (default) - `ohio` - `virginia` - `frankfurt` - `singapore` You can't modify this value after creation. If omitted, the default value is `oregon`. |
| `ipAllowList` | See [Data access control](#data-access-control). |

### PostgreSQL settings

| Field | Description |
|--------|--------|
| `postgresMajorVersion` | The major version number of PostgreSQL to use, as a string (e.g., `"17"`). If omitted, Render uses the most recent version supported by the platform (currently <latest-postgres></latest-postgres>). You can't modify this value after creation. |
| `databaseName` | The name of your database in the PostgreSQL instance. This is different from the [`name`](#name-1) of the Render Postgres instance itself. If omitted, Render automatically generates a name for the database based on [`name`](#name-1). You can't modify this value after creation. |
| `user` | The name of the PostgreSQL user to create for your instance. If omitted, Render automatically generates a name for the database based on [`name`](#name-1). You can't modify this value after creation. |

### Database replicas

You can add two types of replica to a Render Postgres instance:

- [Read replicas](#readreplicas) for increased query throughput
- A [high availability standby](#highavailability) for rapid recovery from primary instance failures

| Field | Description |
|--------|--------|
| `readReplicas` | Add one or more read replicas to a Render Postgres instance with the following syntax: `readReplicas:   - name: my-db-replica` Note the following: - You can add up to five read replicas to a given Render Postgres instance. - If you omit this field, Render _preserves_ any existing read replicas for the instance. - If you provide different `name` values from a database's existing read replicas, Render creates a _new_ replica for each new name and _destroys_ any existing replicas that don't match any provided name. - If you provide an empty list (e.g., `readReplicas: []`), Render destroys any existing replicas and does _not_ create new replicas. - You can reference a read replica's properties in another service's environment variables, as you would for any other database. See [Referencing values from other services](#referencing-values-from-other-services). For more information, see [Read Replicas for Render Postgres](postgresql-read-replicas). |
| `highAvailability` | Add a high availability **standby** to a Render Postgres instance with the following syntax: `highAvailability:   enabled: true` **For your database to support high availability, it _must_:** - Belong to a [**Professional** workspace](professional-features) or higher - Use the **Pro** instance type or higher - Use **PostgreSQL version 13 or later** For more information, see [High Availability for Render Postgres](postgresql-high-availability). |

## Data access control

To control which IP addresses can access your Render Postgres and Key Value instances from outside Render's network, use the `ipAllowList` field:

```yaml
ipAllowList:
  - source: 203.0.113.4/30
    description: office # optional
  - source: 198.51.100.1
```

The `ipAllowList` field is required for Key Value instances. If you omit this field for a Render Postgres database, _any_ source with valid credentials can access the database.

IP address ranges use [CIDR notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_blocks). The `description` field is optional.

To block _all_ external connections, provide an empty list:

```yaml
ipAllowList: [] # Only allow internal connections
```

To _allow_ all external connections, provide the following CIDR block:

```yaml
ipAllowList: # allow external connections from everywhere
  - source: 0.0.0.0/0
    description: everywhere
```

Learn more about access control for [Render Postgres](postgresql-creating-connecting#restricting-external-access) and [Render Key Value](key-value#enabling-external-connections).

## Projects and environments

> Learn more about [projects and environments](projects).

**Show an example project definition**

```yaml
projects:
  - name: my-project
    environments:
      - name: production
        # These resources will belong to the my-project/production environment.
        # Do not duplicate these definitions at the root level.
        services:
          - name: my-web-service
            type: web
            runtime: node
            buildCommand: npm install
            startCommand: npm start
            envVars:
              - key: MY_ENV_VAR
                value: my-value
        databases:
          - name: my-database
            plan: basic-256mb
        envVarGroups:
          - name: my-env-group
            envVars:
              - key: MY_ENV_VAR
                value: my-value
        # Environment-specific settings
        networking:
          isolation: enabled
        permissions:
          protection: enabled
```

### Project fields

| Field | Description |
|--------|--------|
| `name` | **Required.** The project's name. |
| `environments` | **Required.** A list of the project's [environments](#environment-fields). Each project must have at least one environment. |

### Environment fields

| Field | Description |
|--------|--------|
| `name` | **Required.** The environment's name. |
| `services` | A list of the [services](#services) that belong to the environment. Matches the format of the root-level [`services`](#services) field. **Do not define the same service in more than one location.** |
| `databases` | A list of the [Render Postgres databases](#databases) that belong to the environment. Matches the format of the root-level [`databases`](#databases) field. **Do not define the same database in more than one location.** |
| `envVarGroups` | A list of the environment groups that belong to the environment. Matches the format of the root-level [`envVarGroups`](#environment-groups) field. **Do not define the same environment group in more than one location.** |
| `networking.isolation` | Controls [private network isolation](projects#blocking-cross-environment-traffic) for the environment. `networking:   isolation: enabled # Block private network traffic into/out of environment` Supported values include: - `enabled` - `disabled` If omitted, the default value is `disabled`. |
| `permissons.protection` | Controls whether the environment is [protected](projects#protected-environments), which prevents destructive actions by non-admin workspace members. `permissions:   protection: enabled # Prevent destructive actions by non-admins` Supported values include: - `enabled` - `disabled` If omitted, the default value is `disabled`. |

## Setting environment variables

Set names and values for a service's environment variables in the `envVars` field:

```yaml
envVars:
  # Sets a hardcoded value
  # (DO NOT hardcode secrets in your Blueprint file!)
  - key: API_BASE_URL
    value: https://api.example.com

  # Generates a base64-encoded 256-bit value
  # (unless a value already exists)
  - key: APP_SECRET
    generateValue: true

  # Prompts for a value in the Render Dashboard on creation
  # (useful for secrets)
  - key: STRIPE_API_KEY
    sync: false

  # References a property of a database
  # (see available properties below)
  - key: DATABASE_URL
    fromDatabase:
      name: mydatabase
      property: connectionString

  # References an environment variable of another service
  # (see available properties below)
  - key: MINIO_PASSWORD
    fromService:
      name: minio
      type: pserv
      envVarKey: MINIO_ROOT_PASSWORD

  # Adds all environment variables from an environment group
  - fromGroup: my-env-group
```

> A Blueprint can create new environment variables or modify the values of existing ones. Render _preserves_ existing environment variables, even if you omit them from the Blueprint file.

### Referencing values from other services

When setting an environment variable in a Blueprint file, you can reference certain values from your other Render services.

> You _can_ reference a service that isn't in the Blueprint, but that service must exist in your workspace for the Blueprint to be valid.

To reference a value from _most_ service types, use the `fromService` field. For Render Postgres, instead use `fromDatabase`:

```yaml
# Any non-Postgres service
- key: MINIO_HOST
  fromService:
    name: minio
    type: pserv
    property: host

# Render Postgres
- key: DATABASE_URL
  fromDatabase:
    name: mydatabase
    property: connectionString
```

To reference another service's environment variable, set `envVarKey` instead of `property`:

```yaml
- key: MINIO_PASSWORD
  fromService:
    name: minio
    type: pserv
    envVarKey: MINIO_ROOT_PASSWORD
```

- **In all cases,** provide the service's `name`, along with the `property` or `envVarKey` to use.
- **For `fromService`,** you must also provide the referenced service's [`type`](#type).

Supported values of `property` include:

| Property | Description |
|--------|--------|
| `host` | [Web services](web-services) and [private services](private-services) only. The service's hostname on the [private network](private-network). |
| `port` | [Web services](web-services) and [private services](private-services) only. The port of the service's HTTP server. |
| `hostport` | [Web services](web-services) and [private services](private-services) only. The service's [host](#host) and [port](#port), separated by a colon. Use this value to connect to the service over the [private network](private-network). Example: `my-service:10000` |
| `connectionString` | Render Postgres and Key Value only. The URL for connecting to the datastore over the [private network](private-network). - **For Render Postgres,** has the format `postgresql://user:password@host:port/database` - **For Render Key Value,** has the format `redis://red-xxxxxxxxxxxxxxxxxxxx:6379` (or `redis://user:password@red-xxxxxxxxxxxxxxxxxxxx:6379` if [internal authentication](key-value#requiring-auth-for-internal-connections) is enabled) |
| `user` | Render Postgres only. The name of the user for your PostgreSQL database. Included as a component of [`connectionString`](#connectionstring). |
| `password` | Render Postgres only. The password for your PostgreSQL database. Included as a component of [`connectionString`](#connectionstring). |
| `database` | Render Postgres only. The name of your database within the PostgreSQL instance (_not_ the `name` of the PostgreSQL instance itself). Included as a component of [`connectionString`](#connectionstring). |

### Prompting for secret values

Some environment variables contain secret credentials, such an API key or access token. **Do not hardcode these values in your `render.yaml` file!**

Instead, you can define these environment variables with `sync: false`, like so:

```yaml
- key: STRIPE_API_KEY
  sync: false
```

During the initial Blueprint creation flow in the [Render Dashboard][dboard], you're prompted to provide a value for each environment variable with `sync: false`:

[img]

**Note the following limitations:**

- Render prompts you for these values _only during the initial Blueprint creation flow_.
  - When you update an existing Blueprint, Render _ignores_ any environment variables with `sync: false`.
  - Add any new secret credentials to your existing services [manually](configure-environment-variables#setting-environment-variables).
- Render does not include `sync: false` environment variables in [preview environments](preview-environments).
  - As a workaround, you can _also_ manually define the environment variable in an environment group that you apply to the service. For details, see [this page](preview-environments#placeholder-environment-variables).
- You can't apply `sync: false` to environment variables defined in an [environment group](#environment-groups).
  - If you do this, Render ignores the environment variable.

### Generating random secrets

You can generate a random value for an environment variable by setting `generateValue: true`:

```yaml
- key: JWT_SECRET
  generateValue: true
```

If the environment variable doesn't already exist, Render adds it and sets its value to a randomized, base64-encoded, 256-bit value (looks like this: `B0jrphAPOY7pg92AN0c9MN4yecczLMdwnx4OkA1KFUk=`).

### Environment groups

You can define [environment groups](configure-environment-variables#environment-groups) in the root-level `envVarGroups` field of your `render.yaml` file:

```yaml
envVarGroups:
  - name: my-env-group
    envVars:
      - key: CONCURRENCY
        value: 2
      - key: SHARED_SECRET
        generateValue: true
```

Each environment group has a `name` and a list of zero or more `envVars`. Definitions in the `envVars` list can use some (_but not all_) of the same formats as [`envVars` for a service](#setting-environment-variables):

- An environment group can't [reference values](#referencing-values-from-other-services) from your services, or from other environment groups.
- You can't define an environment variable with `sync: false` in an environment group.

### Variable interpolation

Render does not support variable interpolation in a `render.yaml` file.

To achieve a similar behavior, pair environment variables with a build or start script that performs the interpolation for you.