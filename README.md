# Performance framework comparison

The goal is too compare application performances of two regular Spring Boot applications using REST APIs against fully 
cloud-native Micronaut applications using GRPC.

## Schema


## Tests

### Users service

#### Developer metrics

* Compile time
* Test time
* Start dev mode

#### Production metrics

* Start time
* Time to readiness probe ok

##### Load test 10 virtual users

No delay between requests, each virtual execute as many request as possible.

* Requests executed
* Request duration p50, p90, p99
* Success rate
* CPU 
* Memory
