//
//  Duckdb.m
//  NativeModules
//
//  Created by Yash Janoria on 05/01/24.
//

#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(DuckDb, NSObject)

RCT_EXTERN_METHOD(runQuery:(NSString *)query
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end

