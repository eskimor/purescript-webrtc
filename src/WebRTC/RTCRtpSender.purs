module WebRTC.RTCRtpSender where

import Control.Monad.Eff (Eff)
import WebRTC.MediaStream.Track (MediaStreamTrack)


foreign import data RTCRtpSender :: *

foreign import track :: forall e. RTCRtpSender -> Eff e MediaStreamTrack
