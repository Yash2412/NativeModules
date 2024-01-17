//
//  Duckdb.swift
//  NativeModules
//
//  Created by Yash Janoria on 05/01/24.
//

import DuckDB
import Foundation

@objc(DuckDb)
class DuckDb: NSObject {

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  private var db: Database!

  @objc
  override init() {
    super.init()

    do {
      self.db = try Database(store: .inMemory)
    } catch {
      print("Error init database: \(error)")
    }
  }

  func downloadFile(
    from url: URL, to destination: URL, completion: @escaping (Result<URL, Error>) -> Void
  ) {
    URLSession.shared.downloadTask(with: url) { localURL, response, error in
      if let error = error {
        completion(.failure(error))
      } else if let localURL = localURL {
        do {
          try FileManager.default.moveItem(at: localURL, to: destination)
          completion(.success(destination))
        } catch {
          completion(.failure(error))
        }
      }
    }.resume()
  }

  @objc
  func runQuery(
    _ query: String, resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    do {
      let connection = try db.connect()

      print(query)
      let result = try connection.query(query)
      print(result)

      resolver([result.debugDescription])

      // let url = URL(string: "http://localhost:4445/allergy1.parquet")!
//       let destination = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
//         .appendingPathComponent("allergy1.parquet")

      // let jsonDest = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
      //   .appendingPathComponent("temp.json")

      // downloadFile(from: url, to: destination) { result in
      //   switch result {
      //   case .success(let localURL):
      //     print("File downloaded to:", localURL)
      //   case .failure(let error):
      //     print("Download error:", error)
      //   }
      // }

    } catch {
      print(error)
      rejecter("E_RUN_QUERY", "Failed to run query", error)
    }
  }
}

//class Duckdb: RCTEventEmitter {

//  @available(iOS 16.0, *)
//  @objc
//  static func create() async throws -> Duckdb {
//    let (csvFileURL, _) = try await URLSession.shared.download(from: Self.csvRemoteURL)
//    let database = try Database(store: .inMemory)
//    let connection = try database.connect()
//    let _ = try connection.query(
//      "CREATE TABLE exoplanets AS SELECT * FROM read_csv_auto('\(csvFileURL.path)');")
//    return Duckdb(database: database, connection: connection)
//  }
//
//  var database: Database
//  var connection: Connection
//
//  init(database: Database, connection: Connection) {
//    self.database = database
//    self.connection = connection
//    super.init()
//  }
//
//  @objc
//  func getTableData(_ callback: @escaping RCTResponseSenderBlock) {
//    print("Inside GetTable")
//    print(
//      "CREATE TABLE exoplanets AS SELECT * FROM read_csv_auto('https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name+,+disc_year+from+pscomppars&format=csv');"
//    )
//    let database = try? Database(store: .inMemory)
//    let connection = try? database!.connect()
//
//    // Issue our first query to DuckDB
//    try? connection!.execute(
//      """
//      CREATE TABLE exoplanets AS (
//        SELECT * FROM read_csv_auto('https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name+,+disc_year+from+pscomppars&format=csv')
//      );
//      """)
//
//    let result = try? connection!.query(
//      """
//      SELECT *
//        FROM exoplanets
//      """)
//
//    print("Inside GetTable")
//    print(result)
//    callback(["Callback Inside GetTable", { result }, { database }, { connection }])
//  }
//
//  private var count = 0
//
//  @objc
//  func increment(_ callback: RCTResponseSenderBlock) {
//    count += 1
//    print("Count inside increment", count)
//    callback([count])
//    sendEvent(withName: "onIncrement", body: ["count increase", count])
//  }
//
//  @objc
//  override static func requiresMainQueueSetup() -> Bool {
//    return true
//  }
//
//  @objc
//  override func constantsToExport() -> [AnyHashable: Any]! {
//    return ["Duckdb Instance": 0]
//  }
// func groupedByDiscoveryYear() async throws -> DataFrame {
//   let result = try connection.query(
//     """
//     SELECT disc_year, COUNT(disc_year) AS Count
//       FROM exoplanets
//       GROUP BY disc_year
//       ORDER BY disc_year
//     """)
//   let discoveryYearColumn = result[0].cast(to: Int.self)
//   let countColumn = result[1].cast(to: Int.self)
//   return DataFrame(columns: [
//     TabularData.Column(discoveryYearColumn)
//       .eraseToAnyColumn(),
//     TabularData.Column(countColumn)
//       .eraseToAnyColumn(),
//   ])
// }
//}

//@available(iOS 16.0, *)
//extension Duckdb {
//
//  @available(iOS 16.0, *)
//  static let csvRemoteURL: URL = {
//    let apiEndpointURL = URL(
//      string: "https://exoplanetarchive.ipac.caltech.edu/TAP/sync")!
//    // column descriptions available at:
//    // https://exoplanetarchive.ipac.caltech.edu/docs/API_PS_columns.html
//    let remoteQueryColumns = [
//      "pl_name",
//      "hostname",
//      "sy_snum",
//      "disc_year",
//      "disc_facility",
//      "st_mass",
//      "st_rad",
//      "st_age",
//    ]
//    let remoteQuery = """
//      SELECT+\(remoteQueryColumns.joined(separator: "+,+"))+FROM+pscomppars
//      """
//    return apiEndpointURL.appending(queryItems: [
//      .init(name: "query", value: remoteQuery),
//      .init(name: "format", value: "csv"),
//    ])
//  }()
//}
