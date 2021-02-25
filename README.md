# Performance framework comparison

The goal is too compare application performances of two regular Spring Boot applications using REST APIs against fully 
cloud-native Micronaut applications using GRPC.

## Schema


## Tests

### Developer metrics

Developer metrics gathered using a machine with the following specs: 
* CPU: i7 7700K 4.20 GHz
* RAM: 32 GB
* OS: Windows 10 Professional

#### Compilation

| Application | Full compilation (gradle clean compileKotlin --rerun-tasks) | Compilation after change (gradle compileKotlin) |
| ------------| ----------------------------------------------------------- | ----------------------------------------------- |
| Micronaut Users | 7s | 4s |
| Micronaut Availability | 8s | 5s |
| Spring Boot Users | 2s | 2s |
| Spring Boot Availability | 2s | 2s |

Spring Boot performs better regarding compilation time since both Micronaut applications requires additional steps to compile code. Micronaut leverages AOT compilation to avoid using JDK proxies at runtime which takes few seconds to compile using KAPT. Furthermore, both Micronaut application are based on GRPC communication which requires additionnal compilation steps to create stubs, requests and responses.


#### Test

| Application | Testing time (gradle test) | Number of tests |
| ------------| -------------------------- | --------------- |
| Micronaut Users | 19s | 58 |
| Micronaut Availability | 20s | 84 |
| Spring Boot Users | 26s | 54 |
| Spring Boot Availability | 35s | 62 |

Micronaut outperforms Spring Boot during tests phases since most of the work is done at compile time. Micronaut GRPC based application are also faster since GRPC does not require to use a third party contract testing library.

#### Startup time

| Application | Startup time |
| ------------| ------------ |
| Micronaut Users | 3.3s |
| Micronaut Availability | 3.4s |
| Spring Boot Users | 12.4s |
| Spring Boot Availability | 12.7s |

Micronaut clearly outperforms Spring Boot as in tests phases since most of the work is done at compile time.

### Production metrics

Production metrics gathered using a GCP machine 'e2-highcpu-8 ' with the following specs:
* CPU: 8 cores
* RAM: 8 GB
* OS: Linux

| Application | Startup time | Readiness time |
| ------------| ------------ | -------------- |
| Micronaut Users | 3.3s | 8s |
| Micronaut Availability | 3.4s | 8s |
| Spring Boot Users | 6.8s | 13s |
| Spring Boot Availability | 6.9s | 12s |

As on local machine startup time tests, Micronaut outperforms Spring Boot most.

### Performance tests

#### Single machine (16 CPUs) / Memory limited to 512Mo / Single application instance

##### Users service

###### 200 VUs waiting 1 second between each call

| Metrics                         | Micronaut     | Spring Boot |
|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | 45584         | 45628       |
| Success rate                    | 100%          | 100%        |
| Istio request duration (p50)    | 3.1ms         | 3.3ms       |
| Istio request duration (p90)    | 4.7ms         | 6.3ms       |
| Istio request duration (p99)    | 8.2ms         | 9.7ms       |
| End user request duration (p50) | 5.09ms        | 4.27ms      |
| End user request duration (p90) | 6.84ms        | 7.5ms       |
| End user request duration (p95) | 7.44ms        | 8.6ms       |
| CPU usage                       | 0.168         | 0.241       |
| Memory usage                    | 286Mo         | 324Mo       |

###### 500 VUs waiting 1 second between each call

| Metrics                         | Micronaut     | Spring Boot |
|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | 112464        | 113960      |
| Success rate                    | 100%          | 100%        |
| Istio request duration (p50)    | 3.1ms         | 3.4ms       |
| Istio request duration (p90)    | 4.8ms         | 6.8ms       |
| Istio request duration (p99)    | 9.0ms         | 10.0ms      |
| End user request duration (p50) | 5.14ms        | 4.05ms      |
| End user request duration (p90) | 7.26ms        | 7.34ms      |
| End user request duration (p95) | 8.08ms        | 8.49ms      |
| CPU usage                       | 0.402         | 0.525       |
| Memory usage                    | 289Mo         | 348Mo       |

###### 1000 VUs waiting 1 second between each call

| Metrics                         | Micronaut     | Spring Boot |
|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | 228008        | 219164      |
| Success rate                    | 100%          | 100%        |
| Istio request duration (p50)    | 3.0ms         | 4ms         |
| Istio request duration (p90)    | 4.7ms         | 22ms        |
| Istio request duration (p99)    | 7.6ms         | 748ms       |
| End user request duration (p50) | 4.47ms        | 5.11ms      |
| End user request duration (p90) | 6.78ms        | 27.24ms     |
| End user request duration (p95) | 7.77ms        | 58.98ms     |
| CPU usage                       | 0.57          | 0.830       |
| Memory usage                    | 262Mo         | 387Mo       |

##### Load test 100 virtual users, no delay between requests

| Metrics                         | Micronaut     | Spring Boot |
|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | 67672         | 67584       |
| Success rate                    | 100%          | 100%        |
| Istio request duration (p50)    | 3.0ms         | 3.2ms       |
| Istio request duration (p90)    | 4.6ms         | 4.9ms       |
| Istio request duration (p99)    | 5ms           | 9.5ms       |
| End user request duration (p50) | 3.21ms        | 3.61ms      |
| End user request duration (p90) | 5.39ms        | 6.46ms      |
| End user request duration (p95) | 6.04ms        | 7.51ms      |
| CPU usage                       | 0.26          | 0.35        |
| Memory usage                    | 283Mo         | 397Mo       |

##### Load test 200 virtual users, no delay between requests

| Metrics                         | Micronaut     | Spring Boot |
|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | 135256        | 135124      |
| Success rate                    | 100%          | 100%        |
| Istio request duration (p50)    | 3.02ms        | 3.2ms       |
| Istio request duration (p90)    | 4.63ms        | 4.9ms       |
| Istio request duration (p99)    | 5ms           | 9.7ms       |
| End user request duration (p50) | 3.26ms        | 3.61ms      |
| End user request duration (p90) | 5.3ms         | 6.47ms      |
| End user request duration (p95) | 6.07ms        | 7.77ms      |
| CPU usage                       | 0.31          | 0.56        |
| Memory usage                    | 279Mo         | 398Mo       |

##### Load test 400 virtual users, no delay between requests

| Metrics                         | Micronaut     | Spring Boot |
|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | 235004        | X    |
| Success rate                    | 100%          | X    |
| Istio request duration (p50)    | 7ms           | X    |
| Istio request duration (p90)    | 25ms          | X    |
| Istio request duration (p99)    | 950ms         | X    |
| End user request duration (p50) | 10.79ms       | X    |
| End user request duration (p90) | 26.39ms       | X    |
| End user request duration (p95) | 753.28ms      | X    |
| CPU usage                       | 0.408         | X    |
| Memory usage                    | 289Mo         | X    |

##### Availability service

###### 200 VUs waiting 1 second between each call

| Metrics                         | Micronaut     | Spring Boot |
|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | 52127         | X           |
| Success rate                    | 100%          | X           |
| Istio request duration (p50)    | 3.9ms         | X           |
| Istio request duration (p90)    | 8.5ms         | X           |
| Istio request duration (p99)    | 9.9ms         | X           |
| End user request duration (p50) | 5.14ms        | X           |
| End user request duration (p90) | 10.1ms        | X           |
| End user request duration (p95) | 10.94ms       | X           |
| CPU usage                       | 0.213         | X           |
| Memory usage                    | 254Mo         | X           |

###### 500 VUs waiting 1 second between each call

| Metrics                         | Micronaut     | Spring Boot |
|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | 130285        | X           |
| Success rate                    | 100%          | X           |
| Istio request duration (p50)    | 4.1ms         | X           |
| Istio request duration (p90)    | 8.7ms         | X           |
| Istio request duration (p99)    | 12.9ms        | X           |
| End user request duration (p50) | 5.62ms        | X           |
| End user request duration (p90) | 9.95ms        | X           |
| End user request duration (p95) | 11.01ms       | X           |
| CPU usage                       | 0.429         | X           |
| Memory usage                    | 254Mo         | X           |

###### 1000 VUs waiting 1 second between each call

| Metrics                         | Micronaut     | Spring Boot |
|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | 259544        | X           |
| Success rate                    | 100%          | X           |
| Istio request duration (p50)    | 4.7ms         | X           |
| Istio request duration (p90)    | 13.0ms        | X           |
| Istio request duration (p99)    | 23.8ms        | X           |
| End user request duration (p50) | 7.05ms        | X           |
| End user request duration (p90) | 15.19ms       | X           |
| End user request duration (p95) | 23.04ms       | X           |
| CPU usage                       | 0.701         | X           |
| Memory usage                    | 257Mo         | X           |

##### Load test 100 virtual users, no delay between requests

| Metrics                         | Micronaut     | Spring Boot |
|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | X             | X           |
| Success rate                    | X             | X           |
| Istio request duration (p50)    | X             | X           |
| Istio request duration (p90)    | X             | X           |
| Istio request duration (p99)    | X             | X           |
| End user request duration (p50) | X             | X           |
| End user request duration (p90) | X             | X           |
| End user request duration (p95) | X             | X           |
| CPU usage                       | X             | X           |
| Memory usage                    | X             | X           |

##### Load test 200 virtual users, no delay between requests

| Metrics                         | Micronaut     | Spring Boot |
|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | X             | X           |
| Success rate                    | X             | X           |
| Istio request duration (p50)    | X             | X           |
| Istio request duration (p90)    | X             | X           |
| Istio request duration (p99)    | X             | X           |
| End user request duration (p50) | X             | X           |
| End user request duration (p90) | X             | X           |
| End user request duration (p95) | X             | X           |
| CPU usage                       | X             | X           |
| Memory usage                    | X             | X           |

##### Load test 400 virtual users, no delay between requests

| Metrics                         | Micronaut     | Spring Boot |
|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | X             | X           |
| Success rate                    | X             | X           |
| Istio request duration (p50)    | X             | X           |
| Istio request duration (p90)    | X             | X           |
| Istio request duration (p99)    | X             | X           |
| End user request duration (p50) | X             | X           |
| End user request duration (p90) | X             | X           |
| End user request duration (p95) | X             | X           |
| CPU usage                       | X             | X           |
| Memory usage                    | X             | X           |

#### Two machines (4 CPUs each) / Single application instance

#### Two machines (4 CPUs each) / Two application instances
