name := "zad2"
version := "1.0"
scalaVersion := "3.3.1"

enablePlugins(PlayScala)

libraryDependencies ++= Seq(
  guice,
  "org.playframework" %% "play-json" % "3.0.2",
  "org.scalatestplus.play" %% "scalatestplus-play" % "6.0.0-M3" % Test
)
