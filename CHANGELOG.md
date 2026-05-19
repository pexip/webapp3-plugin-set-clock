# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this
project adheres to [Semantic Versioning](http://semver.org/).

## [1.1.0] - 2026-05-19

### Added

- Add support for a configuration file for modifying the clock settings.
- Add support for changing the clock type to `elapsed`, `remaining`, or `time`.

### Changed

- Update dependencies.
- Avoid sending the `set_clock` request if a clock is already configured for the
  conference.
- Set the minimum `node` version to v22.19.0 and the minimum `npm` version to
  v10.9.3.

### Fixed

- Fix the clock name when registering the plugin.

## [1.0.0] - 2026-05-05

### Added

- First version.
