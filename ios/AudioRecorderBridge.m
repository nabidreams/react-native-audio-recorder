#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AudioRecorder, NSObject)

RCT_EXTERN_METHOD(sampleMethod:(NSString *)stringArgument numberArgument:(nonnull NSInteger *)numberArgument callback:(RCTResponseSenderBlock)callback)

@end
