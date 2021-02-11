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
| Total calls                     | 45584         |             |
| Success rate                    | 100%          |             |
| Istio request duration (p50)    | 3.1ms         |             |
| Istio request duration (p90)    | 4.7ms         |             |
| Istio request duration (p99)    | 8.2ms         |             |
| End user request duration (p50) | 5.09ms        |             |
| End user request duration (p90) | 6.84ms        |             |
| End user request duration (p95) | 7.44ms        |             |
| CPU usage                       | 0.168         |             |
| Memory usage                    | 286Mo         |             |

###### 500 VUs waiting 1 second between each call

| Metrics                         | Micronaut     | Spring Boot |
|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | 112464        |             |
| Success rate                    | 100%          |             |
| Istio request duration (p50)    | 3.1ms         |             |
| Istio request duration (p90)    | 4.8ms         |             |
| Istio request duration (p99)    | 9.0ms         |             |
| End user request duration (p50) | 5.14ms        |             |
| End user request duration (p90) | 7.26ms        |             |
| End user request duration (p95) | 8.08ms        |             |
| CPU usage                       | 0.402         |             |
| Memory usage                    | 289Mo         |             |

###### 1000 VUs waiting 1 second between each call

| Metrics                         | Micronaut     | Spring Boot |
|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | 179916        |             |
| Success rate                    | 100%          |             |
| Istio request duration (p50)    | 3.4ms         |             |
| Istio request duration (p90)    | 6.8ms         |             |
| Istio request duration (p99)    | 10ms          |             |
| End user request duration (p50) | 6.17ms        |             |
| End user request duration (p90) | 10.46ms       |             |
| End user request duration (p95) | 13.31ms       |             |
| CPU usage                       | 0.762         |             |
| Memory usage                    | 290Mo         |             |

##### Load test 100 virtual users, no delay between requests

|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | 67584         |             |
| Success rate                    | 100%          |             |
| Istio request duration (p50)    | 3.0ms         |             |
| Istio request duration (p90)    | 4.6ms         |             |
| Istio request duration (p99)    | 6ms           |             |
| End user request duration (p50) | 3.92ms        |             |
| End user request duration (p90) | 6.06ms        |             |
| End user request duration (p95) | 6.63ms        |             |
| CPU usage                       | 0.33          |             |
| Memory usage                    | 290Mo         |             |

##### Load test 200 virtual users, no delay between requests

|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | 134948        |             |
| Success rate                    | 100%          |             |
| Istio request duration (p50)    | 3.0ms         |             |
| Istio request duration (p90)    | 4.6ms         |             |
| Istio request duration (p99)    | 6.2ms         |             |
| End user request duration (p50) | 4.04ms        |             |
| End user request duration (p90) | 6.11ms        |             |
| End user request duration (p95) | 6.77ms        |             |
| CPU usage                       | 0.45          |             |
| Memory usage                    | 290Mo         |             |

##### Load test 500 virtual users, no delay between requests

|:-------------------------------:|:-------------:|:-----------:|
| Total calls                     | 179916        |             |
| Success rate                    | 100%          |             |
| Istio request duration (p50)    | 6ms           |             |
| Istio request duration (p90)    | 31ms          |             |
| Istio request duration (p99)    | 959ms         |             |
| End user request duration (p50) | 10.99ms       |             |
| End user request duration (p90) | 27.66ms       |             |
| End user request duration (p95) | 762ms         |             |
| CPU usage                       | 0.52          |             |
| Memory usage                    | 292Mo         |             |

#### Two machines (4 CPUs each) / Single application instance

#### Two machines (4 CPUs each) / Two application instances
