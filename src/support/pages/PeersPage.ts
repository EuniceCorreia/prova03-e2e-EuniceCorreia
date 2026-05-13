import { Locator, Page, expect } from '@playwright/test';
import PeersElements from '../elements/PeersElements';
import BasePage from './BasePage';

type DadosFormularioPeers = {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  cargo: string;
  mensagem: string;
};

export default class PeersPage extends BasePage {
  readonly peersElements: PeersElements;
  private dadosFormulario?: DadosFormularioPeers;

  constructor(readonly page: Page) {
    super(page);
    this.page = page;
    this.peersElements = new PeersElements(page);
  }

  async validarPaginaInicial(): Promise<void> {
    await expect(this.page).toHaveTitle(/Peers Consulting/);
    await expect(this.peersElements.getPageContent()).toContainText('Sobre');
    await expect(this.peersElements.getPageContent()).toContainText(
      'Nossas solu'
    );
    await expect(this.peersElements.getPageContent()).toContainText(
      'Parceiros de +100'
    );
  }

  async acessarQuemSomos(): Promise<void> {
    await this.peersElements.getQuemSomosLink().click();
  }

  async validarPaginaQuemSomos(): Promise<void> {
    await expect(this.page).toHaveURL(/\/quem-somos\/?$/);
    await expect(this.peersElements.getPageContent()).toContainText(
      'Somos a Peers'
    );
    await expect(this.peersElements.getPageContent()).toContainText(
      'Desde 2012'
    );
  }

  async preencherFormularioContato(): Promise<void> {
    this.dadosFormulario = {
      nome: 'Catherine Dietrich',
      email: 'idline@empresa.com.br',
      telefone: '48999999999',
      empresa: 'Peers QA',
      cargo: 'Analista de QA',
      mensagem: 'Mensagem de teste para validar formulario'
    };

    await this.peersElements.getCampoNome().scrollIntoViewIfNeeded();
    await this.digitarCampo(
      this.peersElements.getCampoEmail(),
      this.dadosFormulario.email
    );
    await this.digitarCampo(
      this.peersElements.getCampoTelefone(),
      this.dadosFormulario.telefone
    );
    await this.peersElements
      .getCampoComoConheceu()
      .selectOption({ label: 'Buscas no Google' });
    await this.digitarCampo(
      this.peersElements.getCampoEmpresa(),
      this.dadosFormulario.empresa
    );
    await this.digitarCampo(
      this.peersElements.getCampoCargo(),
      this.dadosFormulario.cargo
    );
    await this.digitarCampo(
      this.peersElements.getCampoMensagem(),
      this.dadosFormulario.mensagem
    );
    await this.digitarCampo(
      this.peersElements.getCampoNome(),
      this.dadosFormulario.nome
    );
  }

  async validarFormularioPreenchido(): Promise<void> {
    await expect(this.peersElements.getCampoNome()).toHaveValue(
      this.dadosFormulario?.nome ?? ''
    );
    await expect(this.peersElements.getCampoEmail()).toHaveValue(
      this.dadosFormulario?.email ?? ''
    );
    await expect(this.peersElements.getCampoTelefone()).toHaveValue(
      '(48) 99999-9999'
    );
    await expect(this.peersElements.getCampoEmpresa()).toHaveValue(
      this.dadosFormulario?.empresa ?? ''
    );
    await expect(this.peersElements.getCampoCargo()).toHaveValue(
      this.dadosFormulario?.cargo ?? ''
    );
    await expect(this.peersElements.getCampoMensagem()).toHaveValue(
      this.dadosFormulario?.mensagem ?? ''
    );
    await expect(this.peersElements.getCampoComoConheceu()).toHaveValue(
      'Buscas no Google'
    );
  }

  private async digitarCampo(campo: Locator, valor: string): Promise<void> {
    for (let tentativa = 0; tentativa < 3; tentativa++) {
      await campo.click({ position: { x: 10, y: 10 } });
      await expect(campo).toBeFocused();
      await this.page.waitForTimeout(1000);
      await this.page.keyboard.press('Control+A');
      await this.page.keyboard.press('Backspace');
      await this.page.waitForTimeout(200);
      await this.page.keyboard.type(valor, { delay: 100 });
      await this.page.waitForTimeout(300);

      if ((await campo.inputValue()) === valor) {
        return;
      }
    }
  }
}
