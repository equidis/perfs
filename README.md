# Performance framework comparison

The goal is too compare application performances of two regular Spring Boot applications using REST APIs against fully 
cloud-native Micronaut applications using GRPC.

## Schema


## Tests

### Developer metrics

#### Compilation

| Application | Full compilation (gradle clean compileKotlin --rerun-tasks) | Compilation after change (gradle compileKotlin) |
| ------------| ----------------------------------------------------------- | ----------------------------------------------- |
| Micronaut Users | 7s | 4s |
| Micronaut Availability | 8s | 5s |
| Spring Boot Users | 2s | 2s |
| Spring Boot Availability | 2s | 2s |

Spring Boot performs better regarding compilation time since both Micronaut applications requires additionnal steps to compile code. Micronaut leverages AOT compilation to avoid using JDK proxies at runtime which takes few seconds to compile using KAPT. Furthermore, both Micronaut application are based on GRPC communication which requires additionnal compilation steps to create stubs, requests and responses.

* Test time
* Start dev mode

### Production metrics

* Start time
* Time to readiness probe ok

#### Load test 10 virtual users

No delay between requests, each virtual execute as many request as possible.

* Requests executed
* Request duration p50, p90, p99
* Success rate
* CPU 
* Memory
