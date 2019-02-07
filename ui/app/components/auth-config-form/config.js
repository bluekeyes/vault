import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

const AuthConfigBase = Component.extend({
  tagName: '',
  model: null,

  flashMessages: service(),
  router: service(),
  saveModel: task(function*() {
    yield this.model
      .save()
      .then(() => {
        this.router.transitionTo('vault.cluster.access.methods').followRedirects();
        this.flashMessages.success('The configuration was saved successfully.');
      })
      .catch(err => {
        // AdapterErrors are handled by the error-message component
        // in the form
        if (err instanceof DS.AdapterError === false) {
          throw err;
        }
        return;
      });
  }),
});

AuthConfigBase.reopenClass({
  positionalParams: ['model'],
});

export default AuthConfigBase;
