module WebRTC.Util where

import Control.Monad.Eff (Eff)
import Data.Maybe (Maybe)
import Data.Nullable (Nullable, toNullable)
import Prelude (Unit)
import WebRTC.MediaStream.Track (MediaStreamTrack)
import WebRTC.RTC (RTCPeerConnection)


foreign import _onConnectionDrop :: forall e. Eff e Unit -> Nullable MediaStreamTrack -> RTCPeerConnection -> Eff e Unit

onConnectionDrop :: forall e. Eff e Unit -> Maybe MediaStreamTrack -> RTCPeerConnection -> Eff e Unit
onConnectionDrop callback mTrack pc = _onConnectionDrop callback (toNullable mTrack) pc

