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

#### Load test 10 virtual users

No delay between requests, each virtual execute as many request as possible.

* Requests executed
* Request duration p50, p90, p99
* Success rate
* CPU 
* Memory
