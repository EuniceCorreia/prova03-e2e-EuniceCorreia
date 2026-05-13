import { Locator, Page } from '@playwright/test';
import BaseElements from './BaseElements';

export default class PeersElements extends BaseElements {
  constructor(readonly page: Page) {
    super(page);
    this.page = page;
  }

  getPageContent(): Locator {
    return this.page.locator('body');
  }

  getQuemSomosLink(): Locator {
    return this.page.locator('a[href$="/quem-somos/"]:visible').first();
  }

  getCampoNome(): Locator {
    return this.page.locator('#inputNome');
  }

  getCampoEmail(): Locator {
    return this.page.locator('#inputEmail');
  }

  getCampoTelefone(): Locator {
    return this.page.locator('#inputTelefone');
  }

  getCampoComoConheceu(): Locator {
    return this.page.locator('#selectComoNosConheceu');
  }

  getCampoEmpresa(): Locator {
    return this.page.locator('#inputEmpresa');
  }

  getCampoCargo(): Locator {
    return this.page.locator('#inputCargo');
  }

  getCampoMensagem(): Locator {
    return this.page.locator('#inputMensagem');
  }

  getCheckAceite(): Locator {
    return this.page.locator('input[name="concordo"]');
  }
}
