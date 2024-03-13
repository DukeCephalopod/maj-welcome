(() => {
  const getIDs = () => document.getElementById("discord-ids").value.split("\n");
  const getInterests = () =>
    Array.from(
      document
        .getElementById("interests")
        .querySelectorAll('input[name="interest"]:checked'),
    ).map((el) => el.value);
  const oxfordComma = (strings) => {
    if (strings.length === 1) {
      return strings[0];
    } else if (strings.length === 2) {
      return strings.join(" and ");
    }
    strings[strings.length - 1] = `and ${strings[strings.length - 1]}`;
    return strings.join(", ");
  };
  const escapeHtml = (unsafe) => {
    return unsafe
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };
  const fallbackCopy = (text) => {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let success;
    try {
      success = document.execCommand("copy");
      console.log("Fallback: copy", success ? "successful" : "unsuccessful");
    } catch (err) {
      console.error("Fallback: copy error", err);
    }

    document.body.removeChild(textArea);
    return success;
  };
  const extractDiscordIds = (text) => text.match(/\d{17,}/g).join("\n");
  const peasantMode = () => document.getElementById("peasant").checked;

  const runTypes = {
    normal: {
      emoji: "<:grade_any:1131340627171365027>",
      name: "Normal",
      link: "https://discord.com/channels/455380663013736479/1128601421407854643/1174292737089081375",
    },
    classic: {
      emoji: "<:grade_aaa:1116157518138322964>",
      name: "Classic",
      link: "https://discord.com/channels/455380663013736479/1128601421407854643/1174292779820654642",
    },
    fast: {
      emoji: "🏎️",
      name: "Fast",
      link: "https://discord.com/channels/455380663013736479/1128601421407854643/1174292810611044394",
    },
    speed: {
      emoji: "🚀",
      name: "Speed",
      link: "https://discord.com/channels/455380663013736479/1128601421407854643/1174292837723017268",
    },
  };

  const generatePreview = () => {
    const mentions = getIDs().map((x) => `<@${x}>`);
    const you = mentions.length > 1 ? "y'all" : "you";

    const basicWelcome = [
      `Welcome ${oxfordComma(mentions)}!`,
      "",
      `We are happy to have ${you} in **The Majeggstics**, this thread contains some important information but is also a place to ask questions directly to Majeggstics staff regarding the group. When you have time, please read the information in the pins and the following guideline!`,
      "**[Majeggstics Rulebook](<https://docs.google.com/document/d/14CcDG6vY0mSFv2LW-14sWIBlHQap9PtpAgRD4dGSNMs/edit>)**",
      "",
      "Also take a look into the following thread for guides and useful links and information!",
      "**[Cirias amazing infographics and other nice things](<https://discord.com/channels/455380663013736479/1121015323005554808>)**",
    ];
    const interests = getInterests();
    const interestAdditions = interests.map((interest, idx) => {
      const { emoji, name, link } = runTypes[interest];
      const stated = idx > 0 ? "also stated" : "stated";
      return [
        "",
        `### In your recruitment ${you} ${stated} that you are interested in our **${emoji} ${name} Runs ${emoji}**!`,
        `Here you can find a brief overview of our **${name} Runs**: ${link}`,
      ].join("\n");
    });

    let gainAccess = [];
    if (interests.includes("fast") || interests.includes("speed")) {
      gainAccess = [
        "",
        "Since your artifacts have already been confirmed by a recruiter, please do the following to gain access to our runs:",
        "* **AFTER** using /join, please type **‘mj-support’** (without quotes) in any of the chats and we can give you the *Maj Fast Lane* role! You will also gain access to the normal Majeggstics channels automatically with /join.",
      ];
    } else if (interests.includes("normal") || interests.includes("classic")) {
      gainAccess = [
        "",
        "Please do the following to gain access to our runs:",
        "* **AFTER** using /join you will gain access to the Majeggstics channels automatically.",
      ];
    }

    const emoji = peasantMode() ? "🙂" : "<a:ChickenDance:863490801962844200>";
    const mjSupport = [
      "",
      `And of course we are happy to answer any questions ${you} might have! ${emoji} For general questions you can use the https://discord.com/channels/455380663013736479/1103307141311381594; for contract-specific advice just type **‘mj-support’** (without quotes) in the chat and we'll be there to help as soon as we can. You'll get a confirmation that looks like this:`,
    ];

    document.getElementById("preview").innerHTML = [
      "<pre>",
      ...basicWelcome.map(escapeHtml),
      ...interestAdditions.map(escapeHtml),
      ...gainAccess.map(escapeHtml),
      ...mjSupport.map(escapeHtml),
      "</pre>",
    ].join("\n");
  };

  Array.from(document.getElementsByClassName("preview")).forEach((input) => {
    input.addEventListener("input", generatePreview);
  });

  document.getElementById("copy").addEventListener("click", (event) => {
    event.preventDefault();
    const text = document.getElementById("preview").textContent;
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("copy successful");
        })
        .catch(() => {
          console.log("copy unsuccessful");
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  });

  document.getElementById("extract").addEventListener("click", (event) => {
    event.preventDefault();
    const textarea = document.getElementById("discord-ids");
    textarea.value = extractDiscordIds(textarea.value);
    generatePreview();
  });
})();
