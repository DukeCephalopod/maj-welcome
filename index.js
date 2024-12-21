(() => {
  const $ = (selector) =>
    selector.match(/^#\S+$/) // "just an ID"
      ? document.getElementById(selector.slice(1)) // strip # from front
      : document.querySelectorAll(selector);

  const getIDs = () => $("#discord-ids").value.split("\n");
  const getInterests = () =>
    Array.from(
      $("#interests").querySelectorAll('input[name="interest"]:checked'),
    ).map((el) => el.value);

  // oxfordComma(['a']) => 'a'
  // oxfordComma(['a', 'b']) => 'a and b'
  // oxfordComma(['a', 'b', 'c']) => 'a, b, and c'
  const oxfordComma = (strs) => {
    if (strs.length > 2) {
      const l = strs.length - 1;
      strs.splice(0, l, strs.slice(0, l).join(", "));
    }
    return strs.join(" and ");
  };

  // non-exhaustive, but works for the specific characters that appear in preview
  const escapeHtml = (unsafe) => {
    return unsafe
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  // junky ancient copying code for browsers that don't support navigator.clipboard
  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
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

  // any sequence of at least 17 digits that is not in an emoji
  const extractDiscordIds = (text) => {
    const withoutEmoji = text.replace(/<:[^:]+:\d+>/, "");

    return withoutEmoji?.match(/\d{17,}/g)?.join("\n") || "";
  };

  const peasantMode = () => $("#peasant").checked;
  const yeehawMode = () => $("#yeehaw").checked;

  const runTypes = {
    normal: {
      emoji: "<:grade_any:1131340627171365027>",
      name: "Normal",
      link: "https://discord.com/channels/455380663013736479/1128601421407854643/1174292737089081375",
    },
    fast: {
      emoji: "🏎️",
      name: "Fast and Speed",
      link: "https://discord.com/channels/455380663013736479/1128601421407854643/1174292810611044394 and https://discord.com/channels/455380663013736479/1128601421407854643/1174292837723017268",
    },
  };

  const generatePreview = () => {
    const mentions = getIDs().map((x) => `<@${x}>`);
    const you = yeehawMode() && mentions.length > 1 ? "y'all" : "you";

    const basicWelcome = [
      `Welcome ${oxfordComma(mentions)}!`,
      "",
      `We are happy to have ${you} in **The Majeggstics**, this thread contains some important information but is also a place to ask questions directly to Majeggstics staff regarding the group. When you have time, please read the information in the pins and the following guideline!`,
      "**[Majeggstics Rulebook](<https://majeggstics.com/guide/>)**",
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
        "Please do the following to gain access to our runs:",
        "* **AFTER** using /join please direct message <@328925472757121026> to get the *Maj Fast Lane* role and access to the contract channel. You will also gain access to the normal Majeggstics channels automatically with /join.",
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
      `And of course we are happy to answer any questions ${you} might have! ${emoji} For general questions you can ask in https://discord.com/channels/455380663013736479/1103307141311381594; for contract-specific advice just type **‘mj-support’** (without quotes) in the chat and we'll be there to help as soon as we can. You'll get a confirmation that looks like this:`,
    ];

    $("#preview").innerHTML = [
      "<pre>",
      ...basicWelcome.map(escapeHtml),
      ...interestAdditions.map(escapeHtml),
      ...gainAccess.map(escapeHtml),
      ...mjSupport.map(escapeHtml),
      "</pre>",
    ].join("\n");
  };

  Array.from($(".preview")).forEach((input) => {
    input.addEventListener("input", generatePreview);
  });

  $("#copy").addEventListener("click", (event) => {
    event.preventDefault();
    const text = $("#preview").textContent;
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

  $("#extract").addEventListener("click", (event) => {
    event.preventDefault();
    const textarea = $("#discord-ids");
    textarea.value = extractDiscordIds(textarea.value);
    generatePreview();
  });

  $("#spear").addEventListener("click", (event) => {
    event.preventDefault();
    const hue = Math.floor(Math.random() * 36) * 10;
    document.body.style.backgroundColor = `hsl(${hue}deg 100% 96.67%)`;
  });

  $(".info button").forEach((button) => {
    button.title = button.nextElementSibling.innerText;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const span = event.target.nextElementSibling;
      span.style.display = span.checkVisibility() ? "none" : "inline";
    });
  });
})();
