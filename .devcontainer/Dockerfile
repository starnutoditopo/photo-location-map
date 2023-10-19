FROM electronuserland/builder:wine-chrome


# Update node and npm to the latest version
# See: https://www.freecodecamp.org/news/how-to-update-node-and-npm-to-the-latest-version/
RUN npm install -g n
RUN n lts
RUN n latest
RUN n prune
RUN npm install -g npm@latest




# Create the user and assign grants
# See: https://code.visualstudio.com/remote/advancedcontainers/add-nonroot-user#_creating-a-nonroot-user

ARG USERNAME=electron
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Create the user
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --shell /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME \
    #
    # [Optional] Add sudo support. Omit if you don't need to install software after connecting.
    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# ********************************************************
# * Anything else you want to do like clean up goes here *
# ********************************************************

# [Optional] Set the default user. Omit if you want to keep the default as root.
USER $USERNAME








# FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye
# RUN npm install -g npm@10.2.0
# RUN sudo apt -y update
# RUN sudo apt -y install build-essential clang libdbus-1-dev libgtk-3-dev \
#                        libnotify-dev libasound2-dev libcap-dev \
#                        libcups2-dev libxtst-dev \
#                        libxss1 libnss3-dev gcc-multilib g++-multilib curl \
#                        gperf bison python3-dbusmock
# # Support to build setup for Windows (see: https://www.electron.build/multi-platform-build)
# #RUN sudo apt -y install --install-recommends winehq-stable
# RUN sudo apt -y install --install-recommends wine
