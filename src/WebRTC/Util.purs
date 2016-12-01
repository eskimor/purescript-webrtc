module WebRTC.Util where

import Prelude
import Control.Monad.Eff (Eff)
import Data.Maybe (Maybe)
import Data.Nullable (toMaybe, Nullable, toNullable)
import Data.Profunctor (lmap)
import WebRTC.MediaStream.Track (MediaStreamTrack)
import WebRTC.RTC (RTCPeerConnection)


foreign import _onConnectionDrop :: forall e. (Nullable Int -> Eff e Unit) -> Nullable MediaStreamTrack -> RTCPeerConnection -> Eff e Unit

-- Callback is called every second with the number of packets received. Once no packets are received for as long as 3 seconds the callback gets called with Nothing and then never again.
onConnectionDrop :: forall e. (Maybe Int -> Eff e Unit) -> Maybe MediaStreamTrack -> RTCPeerConnection -> Eff e Unit
onConnectionDrop callback mTrack pc = _onConnectionDrop (lmap toMaybe $ callback) (toNullable mTrack) pc

