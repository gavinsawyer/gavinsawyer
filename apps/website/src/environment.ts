/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { type Environment } from "@bowstring/interfaces";


export const environment: Environment = {
  app:        "website",
  apis:       {
    firebase: {
      apiKey:            "AIzaSyB4WQ5tRtADuqqWWFH98xVx4pUuf11l67s",
      appId:             "1:150296614736:web:880e35e8314ba1cd81be55",
      authDomain:        "gavinsawyer-44c46.firebaseapp.com",
      databaseURL:       "https://gavinsawyer-44c46-default-rtdb.firebaseio.com",
      measurementId:     "G-BNP2LX0BZF",
      messagingSenderId: "150296614736",
      projectId:         "gavinsawyer-44c46",
      storageBucket:     "gavinsawyer-44c46.appspot.com",
    },
    recaptcha: { siteKey: "6Lci1RIrAAAAAL5WQd6Dxb7c34wMYv3CR1Jafoda" },
  },
  domain:     "gavinsawyer.us",
  production: false,
};
