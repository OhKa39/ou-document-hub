{pkgs, ...}: {
  channel = "stable-24.05";
  packages = [
    pkgs.vim
    pkgs.docker
    pkgs.packer
    pkgs.terraform
    pkgs.jdk22
    pkgs.maven
    pkgs.awscli2
    pkgs.fira-code-symbols
  ];
  env = {};
  services.docker.enable = true;
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "vscodevim.vim"
      "vscjava.vscode-java-pack"
      "rangav.vscode-thunder-client"
      "CoenraadS.bracket-pair-colorizer-2"
      "dracula-theme.theme-dracula"
      "esbenp.prettier-vscode"
      "hashicorp.terraform"
      "ms-azuretools.vscode-docker"
      "PKief.material-icon-theme"
      "redhat.java"
      "Pivotal.vscode-boot-dev-pack"
      "vmware.vscode-spring-boot"
      "vscjava.vscode-java-debug"
      "vscjava.vscode-java-dependency"
      "vscjava.vscode-java-test"
      "vscjava.vscode-maven"
      "vscjava.vscode-spring-boot-dashboard"
      "vscjava.vscode-spring-initializr"
    ];
  };
}