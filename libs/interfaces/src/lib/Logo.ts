/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

export interface Logo {
  "baselineY": number,
  "focusHover"?: {
    "paths"?: Array<{
      "definition": string;
      "opacity": number;
    }>;
    "rects"?: Array<{
      "height": number;
      "width": number;
      "x": number;
      "y": number;
    }>;
  };
  "paths"?: Array<{
    "definition": string;
    "opacity": number;
  }>;
  "rects"?: Array<{
    "height": number;
    "width": number;
    "x": number;
    "y": number;
  }>;
  "viewBoxHeight": number;
  "viewBoxWidth": number;
}
