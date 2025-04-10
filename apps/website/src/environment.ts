/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { type Environment } from "@bowstring/interfaces";


export const environment: Environment = {
  app:        "website",
  apis:       {
    firebase:  {
      apiKey:            "AIzaSyB4WQ5tRtADuqqWWFH98xVx4pUuf11l67s",
      authDomain:        "gavinsawyer-44c46.firebaseapp.com",
      databaseURL:       "https://gavinsawyer-44c46-default-rtdb.firebaseio.com",
      projectId:         "gavinsawyer-44c46",
      storageBucket:     "gavinsawyer-44c46.appspot.com",
      messagingSenderId: "150296614736",
      appId:             "1:150296614736:web:880e35e8314ba1cd81be55",
      measurementId:     "G-BNP2LX0BZF",
    },
    recaptcha: { siteKey: "6Lci1RIrAAAAAL5WQd6Dxb7c34wMYv3CR1Jafoda" },
  },
  domain:     "gavinsawyer.us",
  production: false,
};
