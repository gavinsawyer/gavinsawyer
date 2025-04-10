/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { isPlatformBrowser }               from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { ENVIRONMENT }                     from "@bowstring/injection-tokens";
import { type Environment }                from "@bowstring/interfaces";
import { Loader }                          from "@googlemaps/js-api-loader";


@Injectable({ providedIn: "root" })
export class GoogleMapsApiLoaderService {

  private readonly environment: Environment         = inject<Environment>(ENVIRONMENT);
  private readonly loader: Loader                   = new Loader(
    {
      apiKey:  this.environment.apis.firebase.apiKey,
      version: "weekly",
    },
  );
  private readonly platformId: NonNullable<unknown> = inject<NonNullable<unknown>>(PLATFORM_ID);

  private coreLibrary?: google.maps.CoreLibrary;
  private coreLibraryPromise?: Promise<google.maps.CoreLibrary | null>;
  private drawingLibrary?: google.maps.DrawingLibrary;
  private drawingLibraryPromise?: Promise<google.maps.DrawingLibrary | null>;
  private elevationLibrary?: google.maps.ElevationLibrary;
  private elevationLibraryPromise?: Promise<google.maps.ElevationLibrary | null>;
  private geocodingLibrary?: google.maps.GeocodingLibrary;
  private geocodingLibraryPromise?: Promise<google.maps.GeocodingLibrary | null>;
  private geometryLibrary?: google.maps.GeometryLibrary;
  private geometryLibraryPromise?: Promise<google.maps.GeometryLibrary | null>;
  private journeySharingLibrary?: google.maps.JourneySharingLibrary;
  private journeySharingLibraryPromise?: Promise<google.maps.JourneySharingLibrary | null>;
  private mapsLibrary?: google.maps.MapsLibrary;
  private mapsLibraryPromise?: Promise<google.maps.MapsLibrary | null>;
  private markerLibrary?: google.maps.MarkerLibrary;
  private markerLibraryPromise?: Promise<google.maps.MarkerLibrary | null>;
  private placesLibrary?: google.maps.PlacesLibrary;
  private placesLibraryPromise?: Promise<google.maps.PlacesLibrary | null>;
  private routesLibrary?: google.maps.RoutesLibrary;
  private routesLibraryPromise?: Promise<google.maps.RoutesLibrary | null>;
  private streetViewLibrary?: google.maps.StreetViewLibrary;
  private streetViewLibraryPromise?: Promise<google.maps.StreetViewLibrary | null>;
  private visualizationLibrary?: google.maps.VisualizationLibrary;
  private visualizationLibraryPromise?: Promise<google.maps.VisualizationLibrary | null>;

  public async load(library: "core"): Promise<google.maps.CoreLibrary | null>
  public async load(library: "drawing"): Promise<google.maps.DrawingLibrary | null>
  public async load(library: "elevation"): Promise<google.maps.ElevationLibrary | null>
  public async load(library: "geocoding"): Promise<google.maps.GeocodingLibrary | null>
  public async load(library: "geometry"): Promise<google.maps.GeometryLibrary | null>
  public async load(library: "journeySharing"): Promise<google.maps.JourneySharingLibrary | null>
  public async load(library: "maps"): Promise<google.maps.MapsLibrary | null>
  public async load(library: "marker"): Promise<google.maps.MarkerLibrary | null>
  public async load(library: "places"): Promise<google.maps.PlacesLibrary | null>
  public async load(library: "routes"): Promise<google.maps.RoutesLibrary | null>
  public async load(library: "streetView"): Promise<google.maps.StreetViewLibrary | null>
  public async load(library: "visualization"): Promise<google.maps.VisualizationLibrary | null>
  public async load(library: "core" | "drawing" | "elevation" | "geocoding" | "geometry" | "journeySharing" | "maps" | "marker" | "places" | "routes" | "streetView" | "visualization"): Promise<google.maps.CoreLibrary | google.maps.DrawingLibrary | google.maps.ElevationLibrary | google.maps.GeocodingLibrary | google.maps.GeometryLibrary | google.maps.JourneySharingLibrary | google.maps.MapsLibrary | google.maps.MarkerLibrary | google.maps.PlacesLibrary | google.maps.RoutesLibrary | google.maps.StreetViewLibrary | google.maps.VisualizationLibrary | null> {
    if (!isPlatformBrowser(this.platformId))
      return null;

    switch (library) {
      case "core":
        return this.coreLibrary || this.coreLibraryPromise || ((): Promise<google.maps.CoreLibrary | null> => {
          this.coreLibraryPromise = this.loader.importLibrary("core").then<google.maps.CoreLibrary>(
            (coreLibrary: google.maps.CoreLibrary): google.maps.CoreLibrary => {
              this.coreLibrary = coreLibrary;

              return coreLibrary;
            },
          );

          return this.coreLibraryPromise;
        })();
      case "drawing":
        return this.drawingLibrary || this.drawingLibraryPromise || ((): Promise<google.maps.DrawingLibrary | null> => {
          this.drawingLibraryPromise = this.loader.importLibrary("drawing").then<google.maps.DrawingLibrary>(
            (drawingLibrary: google.maps.DrawingLibrary): google.maps.DrawingLibrary => {
              this.drawingLibrary = drawingLibrary;

              return drawingLibrary;
            },
          );

          return this.drawingLibraryPromise;
        })();
      case "elevation":
        return this.elevationLibrary || this.elevationLibraryPromise || ((): Promise<google.maps.ElevationLibrary | null> => {
          this.elevationLibraryPromise = this.loader.importLibrary("elevation").then<google.maps.ElevationLibrary>(
            (elevationLibrary: google.maps.ElevationLibrary): google.maps.ElevationLibrary => {
              this.elevationLibrary = elevationLibrary;

              return elevationLibrary;
            },
          );

          return this.elevationLibraryPromise;
        })();
      case "geocoding":
        return this.geocodingLibrary || this.geocodingLibraryPromise || ((): Promise<google.maps.GeocodingLibrary | null> => {
          this.geocodingLibraryPromise = this.loader.importLibrary("geocoding").then<google.maps.GeocodingLibrary>(
            (geocodingLibrary: google.maps.GeocodingLibrary): google.maps.GeocodingLibrary => {
              this.geocodingLibrary = geocodingLibrary;

              return geocodingLibrary;
            },
          );

          return this.geocodingLibraryPromise;
        })();
      case "geometry":
        return this.geometryLibrary || this.geometryLibraryPromise || ((): Promise<google.maps.GeometryLibrary | null> => {
          this.geometryLibraryPromise = this.loader.importLibrary("geometry").then<google.maps.GeometryLibrary>(
            (geometryLibrary: google.maps.GeometryLibrary): google.maps.GeometryLibrary => {
              this.geometryLibrary = geometryLibrary;

              return geometryLibrary;
            },
          );

          return this.geometryLibraryPromise;
        })();
      case "journeySharing":
        return this.journeySharingLibrary || this.journeySharingLibraryPromise || ((): Promise<google.maps.JourneySharingLibrary | null> => {
          this.journeySharingLibraryPromise = this.loader.importLibrary("journeySharing").then<google.maps.JourneySharingLibrary>(
            (journeySharingLibrary: google.maps.JourneySharingLibrary): google.maps.JourneySharingLibrary => {
              this.journeySharingLibrary = journeySharingLibrary;

              return journeySharingLibrary;
            },
          );

          return this.journeySharingLibraryPromise;
        })();
      case "maps":
        return this.mapsLibrary || this.mapsLibraryPromise || ((): Promise<google.maps.MapsLibrary | null> => {
          this.mapsLibraryPromise = this.loader.importLibrary("maps").then<google.maps.MapsLibrary>(
            (mapsLibrary: google.maps.MapsLibrary): google.maps.MapsLibrary => {
              this.mapsLibrary = mapsLibrary;

              return mapsLibrary;
            },
          );

          return this.mapsLibraryPromise;
        })();
      case "marker":
        return this.markerLibrary || this.markerLibraryPromise || ((): Promise<google.maps.MarkerLibrary | null> => {
          this.markerLibraryPromise = this.loader.importLibrary("marker").then<google.maps.MarkerLibrary>(
            (markerLibrary: google.maps.MarkerLibrary): google.maps.MarkerLibrary => {
              this.markerLibrary = markerLibrary;

              return markerLibrary;
            },
          );

          return this.markerLibraryPromise;
        })();
      case "places":
        return this.placesLibrary || this.placesLibraryPromise || ((): Promise<google.maps.PlacesLibrary | null> => {
          this.placesLibraryPromise = this.loader.importLibrary("places").then<google.maps.PlacesLibrary>(
            (placesLibrary: google.maps.PlacesLibrary): google.maps.PlacesLibrary => {
              this.placesLibrary = placesLibrary;

              return placesLibrary;
            },
          );

          return this.placesLibraryPromise;
        })();
      case "routes":
        return this.routesLibrary || this.routesLibraryPromise || ((): Promise<google.maps.RoutesLibrary | null> => {
          this.routesLibraryPromise = this.loader.importLibrary("routes").then<google.maps.RoutesLibrary>(
            (routesLibrary: google.maps.RoutesLibrary): google.maps.RoutesLibrary => {
              this.routesLibrary = routesLibrary;

              return routesLibrary;
            },
          );

          return this.routesLibraryPromise;
        })();
      case "streetView":
        return this.streetViewLibrary || this.streetViewLibraryPromise || ((): Promise<google.maps.StreetViewLibrary | null> => {
          this.streetViewLibraryPromise = this.loader.importLibrary("streetView").then<google.maps.StreetViewLibrary>(
            (streetViewLibrary: google.maps.StreetViewLibrary): google.maps.StreetViewLibrary => {
              this.streetViewLibrary = streetViewLibrary;

              return streetViewLibrary;
            },
          );

          return this.streetViewLibraryPromise;
        })();
      case "visualization":
        return this.visualizationLibrary || this.visualizationLibraryPromise || ((): Promise<google.maps.VisualizationLibrary | null> => {
          this.visualizationLibraryPromise = this.loader.importLibrary("visualization").then<google.maps.VisualizationLibrary>(
            (visualizationLibrary: google.maps.VisualizationLibrary): google.maps.VisualizationLibrary => {
              this.visualizationLibrary = visualizationLibrary;

              return visualizationLibrary;
            },
          );

          return this.visualizationLibraryPromise;
        })();
    }
  }

}
