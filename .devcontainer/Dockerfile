FROM xtruder/nix-devcontainer

# cache /nix
VOLUME /nix

RUN mkdir -p /home/${USERNAME}/.run && chown ${USERNAME} /home/${USERNAME}/.run
VOLUME /home/${USERNAME}/.run
