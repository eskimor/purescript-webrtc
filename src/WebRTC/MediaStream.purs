module WebRTC.MediaStream (
  MediaStream(..)
, MediaStreamConstraints(..)
, Blob(..)
, USER_MEDIA()
, getUserMedia
, getTracks
, getAudioTracks
, getVideoTracks
, mediaStreamToBlob
, createObjectURL
, clone
, stopStream
) where

import Prelude
import Control.Monad.Aff (Aff, makeAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Exception (Error)
import Data.Foldable (traverse_)
import Unsafe.Coerce (unsafeCoerce)
import WebRTC.MediaStream.Track (MediaStreamTrack)
import WebRTC.MediaStream.Track as Track

foreign import data MediaStream :: *

foreign import _getUserMedia
  :: forall e. (MediaStream -> Eff e Unit) ->
               (Error -> Eff e Unit) ->
               MediaStreamConstraints ->
               Eff e Unit

foreign import data USER_MEDIA :: !

getUserMedia :: forall e. MediaStreamConstraints -> Aff (userMedia :: USER_MEDIA | e) MediaStream
getUserMedia c = makeAff (\e s -> _getUserMedia s e c)

foreign import clone :: forall e. MediaStream -> Eff e MediaStream

foreign import getTracks :: forall e. MediaStream -> Eff e (Array MediaStreamTrack)
foreign import getAudioTracks :: forall e. MediaStream -> Eff e (Array MediaStreamTrack)
foreign import getVideoTracks :: forall e. MediaStream -> Eff e (Array MediaStreamTrack)

-- Stops all tracks in a stream
stopStream :: forall e. MediaStream -> Eff e Unit
stopStream stream = do
  tracks <- getTracks stream
  traverse_ Track.stop tracks

newtype MediaStreamConstraints =
  MediaStreamConstraints { video :: Boolean
                         , audio :: Boolean
                         }

foreign import data Blob :: *

mediaStreamToBlob :: MediaStream -> Blob
mediaStreamToBlob = unsafeCoerce

foreign import createObjectURL
  :: forall e. Blob -> Eff e String
