#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Audio, NSObject)

RCT_EXTERN_METHOD(sampleMethod:(NSString *)stringArgument numberArgument:(nonnull NSInteger *)numberArgument callback:(RCTResponseSenderBlock)callback)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
