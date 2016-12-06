module WebRTC.MediaStream.Track  where

import Control.Monad.Eff (Eff)
import DOM.Event.Types (Event)
import Prelude (Unit)

foreign import data MediaStreamTrack :: *

foreign import stop :: forall eff. MediaStreamTrack -> Eff eff Unit

foreign import kind :: forall eff. MediaStreamTrack -> Eff eff String

foreign import addEventListener :: forall eff. String -> (Event -> Eff eff Unit) -> MediaStreamTrack -> Eff eff Unit

