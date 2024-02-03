export const server = {
  async authorize(authLogin, authPassword) {
    const users = await fetch("http://localhost:3004/users").then(
      (loadedUsers) => loadedUsers.json()
    );
    const user = users.find(({ login }) => login === authLogin);

    if (!user) {
      return {
        error: "Такой пользователь не найден",
        res: null,
      };
    }
    if (authPassword !== user.user.password) {
      return {
        error: "Неверный пороль",
        res: null,
      };
    }

    const session = {
      logout() {
        Object.keys(session).forEach((key) => {
          delete session[key];
        });
      },
      removeComment() {
        console.log("");
      },
    };
    return {
      error: null,
      res: session,
    };
  },
};
