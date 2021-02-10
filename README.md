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

users service request duration : med=3.2ms, p(90)=4.9ms, p(95)=9.4ms

     checks...............: 100.00% ✓ 44792 ✗ 0    
     data_received........: 4.4 MB  22 kB/s
     data_sent............: 2.4 MB  12 kB/s
     group_duration.......: avg=2.49s   min=1.01s   med=1.02s   max=33.13s  p(90)=2.05s   p(95)=10.02s 
     grpc_req_duration....: avg=26.75ms min=16.45ms med=20.79ms max=445.9ms p(90)=26.93ms p(95)=39.76ms
     iteration_duration...: avg=32.64s  min=9.58µs  med=32.57s  max=33.18s  p(90)=32.97s  p(95)=33.03s 
     iterations...........: 1003    4.942466/s
     vus..................: 12      min=7   max=200
     vus_max..............: 200     min=200 max=200

###### 500 VUs waiting 1 second between each call

users service request duration : med=3.2ms, p(90)=4.9ms, p(95)=9.5ms

    checks...............: 100.00% ✓ 111716 ✗ 0    
    data_received........: 11 MB   54 kB/s
    data_sent............: 6.0 MB  29 kB/s
    group_duration.......: avg=2.5s    min=1.01s   med=1.02s   max=35.43s p(90)=2.05s   p(95)=10.02s
    grpc_req_duration....: avg=33.47ms min=16.31ms med=21.62ms max=2.95s  p(90)=29.77ms p(95)=45.77ms
    iteration_duration...: avg=32.82s  min=2.97µs  med=32.62s  max=36.15s p(90)=33.61s  p(95)=33.79s
    iterations...........: 2497    12.252392/s
    vus..................: 23      min=17   max=500
    vus_max..............: 500     min=500  max=500

##### Load test 10 virtual users

No delay between requests, each virtual execute as many request as possible.

* Requests executed
* Request duration p50, p90, p99
* Success rate
* CPU
* Memory

#### Two machines (4 CPUs each) / Single application instance

#### Two machines (4 CPUs each) / Two application instances
