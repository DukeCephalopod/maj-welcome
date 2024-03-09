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
  const runTypes = {
    casual: {
      emoji: "<:Majeggstic:849350424712839168>",
      name: "Casual",
      link: "https://discord.com/channels/455380663013736479/1128601421407854643/1174292737089081375",
    },
    anygrade: {
      emoji: "<:grade_any:1131326114736898079>",
      name: "Any Grade Buddy",
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
      "",
      `And of course we are happy to answer any questions ${you} might have! You can just type **‘mj-support’** (without quotes) in the chat and we will be there to help you out! <a:ChickenDance:863490801962844200>`,
      "",
    ].join("\n");
    const interests = getInterests();
    const interestAdditions = interests.map((interest, idx) => {
      const { emoji, name, link } = runTypes[interest];
      const stated = idx > 0 ? "also stated" : "stated";
      return [
        `### In your recruitment you ${stated} that you are interested in our **${emoji} ${name} ${emoji}**!`,
        `Here you can find a brief overview of how our **${name}** work: ${link}`,
        "",
      ].join("\n");
    });

    let gainAccess = [];
    if (interests.includes("fast") || interests.includes("speed")) {
      gainAccess = [
        "Since your artifacts have already been confirmed by a recruiter, please do the following to gain access to our runs:",
        "* **AFTER** using /join, please type **‘mj-support’** (without quotes) in any of the chats and we can give you the *Maj Fast Lane* role! You will also gain access to the normal Majeggstics channels automatically with /join.",
      ];
    } else if (interests.includes("casual") || interests.includes("anygrade")) {
      gainAccess = [
        "Please do the following to gain access to our runs:",
        "* **AFTER** using /join you will gain access to the Majeggstics channels automatically.",
      ];
    }

    document.getElementById("preview").innerHTML = [
      "<pre>",
      basicWelcome,
      ...interestAdditions,
      ...gainAccess,
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
})();
