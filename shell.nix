{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-21.11.tar.gz") { } }:

pkgs.mkShell {
  # nativeBuildInputs is usually what you want -- tools you need to run
  nativeBuildInputs = with pkgs; [
    nixpkgs-fmt
    rnix-lsp
    docker-client
    gnumake

    # nodejs
    nodejs-16_x

    chromium
  ];

  shellHook = ''
    PATH=$PWD/node_modules/.bin:$PATH
    export FONTCONFIG_FILE=${pkgs.fontconfig.out}/etc/fonts/fonts.conf
    export BROWSERBOI_CHROME_PATH=chromium
  '';
}
