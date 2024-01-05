//
//  Duckdb.m
//  NativeModules
//
//  Created by Yash Janoria on 05/01/24.
//

#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(Duckdb, RCTEventEmitter)

RCT_EXTERN_METHOD(increment:(RCTResponseSenderBlock)callback);
RCT_EXTERN_METHOD(getTableData:(RCTResponseSenderBlock)callback);

@end

