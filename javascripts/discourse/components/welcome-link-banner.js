import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
import { inject as service } from "@ember/service";
import { computed } from "@ember/object";
import { not, and, or, alias } from "@ember/object/computed";
import { defaultHomepage } from "discourse/lib/utilities";
export default Component.extend({
  router: service(),

  bannerLinks: computed("showSecondBanner", function () {
    if (this.showSecondBanner) {
      return JSON.parse(settings.second_banner_links);
    } else {
      return JSON.parse(settings.banner_links);
    }
  }),

  showToSubject: or("showToGuest", "showToUser"),

  @discourseComputed("currentUser")
  showToGuest(currentUser) {
    return !currentUser && settings.show_to_guests;
  },

  @discourseComputed("showTrust", "showSecondBanner")
  showToUser(showTrust, showSecondBanner) {
    return (showTrust || showSecondBanner) && settings.show_to_users;
  },

  @discourseComputed("currentUser")
  showTrust(currentUser) {
    return (
      (currentUser && currentUser.trust_level <= settings.max_trust_level) ||
      (!currentUser && !settings.hide_for_anon)
    );
  },

  @discourseComputed("currentUser")
  showSecondBanner(currentUser) {
    return currentUser && (currentUser.groups || [])
      .filter(g => settings.show_second_banner_to_group.includes(g.name))
      .length > 0;
  },

  @discourseComputed("currentUser")
  hideStaff(currentUser) {
    return currentUser && currentUser.staff && settings.hide_for_staff;
  },

  @discourseComputed("router.currentRouteName", "router.currentURL")
  showHere(currentRouteName, currentURL) {
    if (settings.show_on === "all") {
      return true;
    }

    if (settings.show_on === "discovery") {
      return currentRouteName.indexOf("discovery") > -1;
    }

    if (settings.show_on === "homepage") {
      return currentRouteName == `discovery.${defaultHomepage()}`;
    }
  },
});
