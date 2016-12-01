module WebRTC.RTC (
  RTCPeerConnection(..)
, RTCSessionDescriptionInit
, RTCSessionDescription(..)
, Ice(..)
, RTCIceServerObject
, FullRTCIceServerObject
, IceEvent(..)
, MediaStreamEvent(..)
, RTCIceCandidateInit(..)
, RTCDataChannel(..)
, newRTCPeerConnection
, connectionState
, iceConnectionState
, closeRTCPeerConnection
, addStream
, onicecandidate
, onnegotiationneeded
, onaddstream
, onconnectionstatechange
, oniceconnectionstatechange
, createOffer
, createAnswer
, setLocalDescription
, setRemoteDescription
, newRTCSessionDescription
, iceEventCandidate
, addIceCandidate
, createDataChannel
, send
, onmessageChannel
, fromRTCSessionDescription
, getStats
, getSenders
, RTCStatsReport
) where

import Prelude
import Control.Monad.Aff (Aff, makeAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Exception (Error)
import DOM.Event.Types (Event)
import Data.Maybe (Maybe(..))
import Data.Nullable (toNullable, toMaybe, Nullable)
import WebRTC.MediaStream (MediaStream)
import WebRTC.MediaStream.Track (MediaStreamTrack)
import WebRTC.RTCRtpSender (RTCRtpSender)

foreign import data RTCPeerConnection :: *

type RTCIceServerObject r   = { urls :: Array String | r }
type FullRTCIceServerObject = { urls :: Array String
                              , username :: String
                              , credential :: String
                              , credentialType :: String
                              }

type Ice r = { iceServers :: Array (RTCIceServerObject r) }

foreign import newRTCPeerConnection
  :: forall e r. Ice r -> Eff e RTCPeerConnection

foreign import addStream
  :: forall e. MediaStream -> RTCPeerConnection -> Eff e Unit

foreign import data IceEvent :: *

type RTCIceCandidateInit = { sdpMLineIndex :: Maybe Int
                           , sdpMid :: Maybe String
                           , candidate :: String
                           }

type RTCIceCandidateInitJS = { sdpMLineIndex :: Nullable Int
                             , sdpMid :: Nullable String
                             , candidate :: String
                             }

iceCandidateToJS :: RTCIceCandidateInit -> RTCIceCandidateInitJS
iceCandidateToJS candidate = { sdpMLineIndex : toNullable candidate.sdpMLineIndex
                             , sdpMid : toNullable candidate.sdpMid
                             , candidate : candidate.candidate
                             }

iceCandidateFromJS :: RTCIceCandidateInitJS -> RTCIceCandidateInit
iceCandidateFromJS candidate = { sdpMLineIndex : toMaybe candidate.sdpMLineIndex
                               , sdpMid : toMaybe candidate.sdpMid
                               , candidate : candidate.candidate
                               }

foreign import _iceEventCandidate
  :: forall a. Maybe a ->
               (a -> Maybe a) ->
               IceEvent ->
               Maybe RTCIceCandidateInitJS

iceEventCandidate :: IceEvent -> Maybe RTCIceCandidateInit
iceEventCandidate = map iceCandidateFromJS <<< _iceEventCandidate Nothing Just

foreign import _addIceCandidate
  :: forall e. Nullable RTCIceCandidateInitJS
     -> RTCPeerConnection
     -> (Error -> Eff e Unit)
     -> (Unit -> Eff e Unit)
     -> Eff e Unit

foreign import connectionState :: forall e. RTCPeerConnection -> Eff e String
foreign import iceConnectionState :: forall e. RTCPeerConnection -> Eff e String

addIceCandidate :: forall e. Maybe RTCIceCandidateInit
                   -> RTCPeerConnection
                   -> Aff e Unit
addIceCandidate candidate connection = makeAff (_addIceCandidate (toNullable <<< map iceCandidateToJS $ candidate) connection)

foreign import onicecandidate
  :: forall e. (IceEvent -> Eff e Unit) ->
               RTCPeerConnection ->
               Eff e Unit

foreign import onconnectionstatechange
  :: forall e. (Event -> Eff e Unit) ->
               RTCPeerConnection ->
               Eff e Unit

foreign import oniceconnectionstatechange
  :: forall e. (Event -> Eff e Unit) ->
               RTCPeerConnection ->
               Eff e Unit

foreign import onnegotiationneeded
  :: forall e. Eff e Unit ->
               RTCPeerConnection ->
               Eff e Unit

type MediaStreamEvent = { stream :: MediaStream }

foreign import onaddstream
  :: forall e. (MediaStreamEvent -> Eff e Unit) ->
               RTCPeerConnection ->
               Eff e Unit


type RTCSessionDescriptionInit = { sdp :: String, "type" :: String }

-- Those should not be needed: -----------------
foreign import fromRTCSessionDescription :: RTCSessionDescription -> RTCSessionDescriptionInit
foreign import data RTCSessionDescription :: *
foreign import newRTCSessionDescription
  :: RTCSessionDescriptionInit -> RTCSessionDescription
----------------------------------

foreign import _createOffer
  :: forall e. (RTCSessionDescriptionInit -> Eff e Unit) ->
               (Error -> Eff e Unit) ->
               RTCPeerConnection ->
               Eff e Unit

createOffer :: forall e. RTCPeerConnection -> Aff e RTCSessionDescriptionInit
createOffer pc = makeAff (\e s -> _createOffer s e pc)

foreign import _createAnswer
  :: forall e. (RTCSessionDescriptionInit -> Eff e Unit) ->
               (Error -> Eff e Unit) ->
               RTCPeerConnection ->
               Eff e Unit

createAnswer :: forall e. RTCPeerConnection -> Aff e RTCSessionDescriptionInit
createAnswer pc = makeAff (\e s -> _createAnswer s e pc)

foreign import _setLocalDescription
  :: forall e. Eff e Unit ->
               (Error -> Eff e Unit) ->
               RTCSessionDescriptionInit ->
               RTCPeerConnection ->
               Eff e Unit

setLocalDescription :: forall e. RTCSessionDescriptionInit -> RTCPeerConnection -> Aff e Unit
setLocalDescription desc pc = makeAff (\e s -> _setLocalDescription (s unit) e desc pc)

foreign import _setRemoteDescription
  :: forall e. Eff e Unit ->
               (Error -> Eff e Unit) ->
               RTCSessionDescriptionInit ->
               RTCPeerConnection ->
               Eff e Unit

setRemoteDescription :: forall e. RTCSessionDescriptionInit -> RTCPeerConnection -> Aff e Unit
setRemoteDescription desc pc = makeAff (\e s -> _setRemoteDescription (s unit) e desc pc)

foreign import data RTCDataChannel :: *

foreign import createDataChannel
  :: forall e. String ->
               RTCPeerConnection ->
               Eff e RTCDataChannel

foreign import send
  :: forall e. String ->
               RTCDataChannel ->
               Eff e Unit

foreign import onmessageChannel
  :: forall e. (String -> Eff e Unit) ->
               RTCDataChannel ->
               Eff e Unit

foreign import closeRTCPeerConnection :: forall e. RTCPeerConnection -> Eff e Unit

foreign import data RTCStatsReport :: *

foreign import _getStats :: forall e. (RTCStatsReport -> Eff e Unit) ->
               (Error -> Eff e Unit) -> Nullable MediaStreamTrack ->
               RTCPeerConnection -> Eff e Unit

getStats :: forall e.  Maybe MediaStreamTrack -> RTCPeerConnection -> Aff e RTCStatsReport
getStats mTrack pc = makeAff (\e s -> _getStats s e (toNullable mTrack) pc)

foreign import getSenders :: forall e. RTCPeerConnection -> Eff e (Array RTCRtpSender)
