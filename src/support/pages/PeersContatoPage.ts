import { Locator, Page, expect } from '@playwright/test';
import PeersElements from '../elements/PeersElements';
import BasePage from './BasePage';

type DadosFormularioPeers = {
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  cargo?: string;
  assunto?: string;
  mensagem: string;
  comoConheceu: string;
};

export default class PeersContatoPage extends BasePage {
  readonly peersElements: PeersElements;
  private dadosFormulario?: DadosFormularioPeers;

  constructor(readonly page: Page) {
    super(page);
    this.page = page;
    this.peersElements = new PeersElements(page);
  }

  async aceitarCookies(): Promise<void> {
    const botaoAceitarCookies = this.peersElements
      .getBotaoAceitarCookies()
      .first();

    try {
      await botaoAceitarCookies.waitFor({ state: 'visible', timeout: 5000 });
      await botaoAceitarCookies.click({ force: true });
      await expect(botaoAceitarCookies).toBeHidden({ timeout: 5000 });
    } catch {
      await this.page.addStyleTag({
        content: '.cmplz-cookiebanner { display: none !important; }'
      });
    }
  }

  async acessarAba(nomeAba: string): Promise<void> {
    const abaFormulario = this.peersElements.getAbaFormulario(nomeAba).first();

    await abaFormulario.scrollIntoViewIfNeeded();
    const idAba = await abaFormulario.getAttribute('id');
    const idPainel = await abaFormulario.getAttribute('aria-controls');
    await abaFormulario.click();

    if (idPainel) {
      const painel = this.page.locator(`#${idPainel}`);

      try {
        await expect(painel).toBeVisible({ timeout: 5000 });
      } catch {
        await this.ativarAbaPorDom(idAba, idPainel);
        await expect(painel).toBeVisible({ timeout: 5000 });
      }
    }
  }

  async preencherFormularioCarreiras(): Promise<void> {
    this.dadosFormulario = {
      nome: 'Catherine Dietrich',
      email: 'catherine.qa@empresa.com.br',
      telefone: '48999999999',
      assunto: 'Interesse em carreira na Peers',
      mensagem: '',
      comoConheceu: 'LinkedIn'
    };

    const formulario = this.getFormularioPorUnitTag('wpcf7-f2810-p2806-o2');

    await this.preencherCampo(
      formulario,
      'input[name="email"]',
      this.dadosFormulario.email
    );
    await this.preencherCampo(
      formulario,
      'input[name="celular"]',
      this.dadosFormulario.telefone
    );
    await this.preencherCampo(
      formulario,
      'input[name="assunto"]',
      this.dadosFormulario.assunto
    );
    await formulario
      .locator('select[name="como_conheceu"]')
      .selectOption({ label: this.dadosFormulario.comoConheceu });
    await formulario.locator('input[name="concordo"]').check({ force: true });
    await this.preencherCampo(
      formulario,
      'input[name="nome"]',
      this.dadosFormulario.nome
    );
    await this.definirValorCampo(
      formulario,
      'input[name="nome"]',
      this.dadosFormulario.nome
    );
    await this.definirValorCampo(
      formulario,
      'input[name="email"]',
      this.dadosFormulario.email
    );
    await this.definirValorCampo(
      formulario,
      'input[name="celular"]',
      this.dadosFormulario.telefone
    );
    await this.definirValorCampo(
      formulario,
      'input[name="assunto"]',
      this.dadosFormulario.assunto
    );
  }

  async preencherFormularioFornecedor(): Promise<void> {
    this.dadosFormulario = {
      nome: 'Carlos Fornecedor',
      email: 'fornecedor.qa@empresa.com.br',
      telefone: '48988888888',
      empresa: 'Fornecedor QA',
      cargo: 'Coordenador Comercial',
      mensagem: 'Mensagem de teste para contato de fornecedor',
      comoConheceu: 'Indicação'
    };

    await this.preencherFormularioSolucoes(
      this.getFormularioPorUnitTag('wpcf7-f3601-p2806-o3')
    );
  }

  async preencherFormularioOutros(): Promise<void> {
    this.dadosFormulario = {
      nome: 'Mariana Outros',
      email: 'outros.qa@empresa.com.br',
      telefone: '48977777777',
      empresa: 'Outros QA',
      cargo: 'Analista de Projetos',
      mensagem: 'Mensagem de teste para contato do tipo outros',
      comoConheceu: 'Outros'
    };

    await this.preencherFormularioSolucoes(
      this.getFormularioPorUnitTag('wpcf7-f3601-p2806-o4')
    );
  }

  async validarFormularioPreenchido(): Promise<void> {
    await expect(this.page.locator('body')).toContainText(
      this.dadosFormulario?.nome ?? ''
    );
  }

  protected getFormularioPorUnitTag(unitTag: string): Locator {
    return this.page.locator(
      `form.wpcf7-form:has(input[name="_wpcf7_unit_tag"][value="${unitTag}"])`
    );
  }

  protected async validarCamposCarreiras(): Promise<void> {
    const formulario = this.getFormularioPorUnitTag('wpcf7-f2810-p2806-o2');

    await expect(formulario.locator('input[name="nome"]')).toHaveValue(
      this.dadosFormulario?.nome ?? ''
    );
    await expect(formulario.locator('input[name="email"]')).toHaveValue(
      this.dadosFormulario?.email ?? ''
    );
    await expect(formulario.locator('input[name="celular"]')).toHaveValue(
      this.dadosFormulario?.telefone ?? ''
    );
    await expect(formulario.locator('input[name="assunto"]')).toHaveValue(
      this.dadosFormulario?.assunto ?? ''
    );
    await expect(
      formulario.locator('select[name="como_conheceu"]')
    ).toHaveValue(this.dadosFormulario?.comoConheceu ?? '');
    await expect(formulario.locator('input[name="concordo"]')).toBeChecked();
  }

  protected async validarCamposSolucoes(unitTag: string): Promise<void> {
    const formulario = this.getFormularioPorUnitTag(unitTag);

    await expect(formulario.locator('input[name="nome"]')).toHaveValue(
      this.dadosFormulario?.nome ?? ''
    );
    await expect(formulario.locator('input[name="email"]')).toHaveValue(
      this.dadosFormulario?.email ?? ''
    );
    await expect(formulario.locator('input[name="telefone"]')).toHaveValue(
      this.formatarTelefone(this.dadosFormulario?.telefone ?? '')
    );
    await expect(formulario.locator('input[name="empresa"]')).toHaveValue(
      this.dadosFormulario?.empresa ?? ''
    );
    await expect(formulario.locator('input[name="cargo"]')).toHaveValue(
      this.dadosFormulario?.cargo ?? ''
    );
    await expect(
      formulario.locator('textarea[name="como_podemos_ajudar"]')
    ).toHaveValue(this.dadosFormulario?.mensagem ?? '');
    await expect(
      formulario.locator('select[name="como_conheceu"]')
    ).toHaveValue(this.dadosFormulario?.comoConheceu ?? '');
    await expect(formulario.locator('input[name="concordo"]')).toBeChecked();
  }

  private async preencherFormularioSolucoes(
    formulario: Locator
  ): Promise<void> {
    await expect(formulario).toBeVisible();

    await this.preencherCampo(
      formulario,
      'input[name="nome"]',
      this.dadosFormulario?.nome
    );
    await this.preencherCampo(
      formulario,
      'input[name="email"]',
      this.dadosFormulario?.email
    );
    await this.preencherCampo(
      formulario,
      'input[name="telefone"]',
      this.dadosFormulario?.telefone
    );
    await formulario
      .locator('select[name="como_conheceu"]')
      .selectOption({ label: this.dadosFormulario?.comoConheceu });
    await this.preencherCampo(
      formulario,
      'input[name="empresa"]',
      this.dadosFormulario?.empresa
    );
    await this.preencherCampo(
      formulario,
      'input[name="cargo"]',
      this.dadosFormulario?.cargo
    );
    await this.preencherCampo(
      formulario,
      'textarea[name="como_podemos_ajudar"]',
      this.dadosFormulario?.mensagem
    );
    await formulario.locator('input[name="concordo"]').check({ force: true });
  }

  private async preencherCampo(
    formulario: Locator,
    seletor: string,
    valor = ''
  ): Promise<void> {
    const campo = formulario.locator(seletor);

    await expect(campo).toBeVisible();
    await campo.scrollIntoViewIfNeeded();
    await this.digitarCampo(campo, valor);
    await this.page.waitForTimeout(80);
  }

  private async digitarCampo(campo: Locator, valor: string): Promise<void> {
    await campo.click({ position: { x: 10, y: 10 } });
    await campo.fill(valor);

    if ((await campo.inputValue()) === '') {
      await this.definirValor(campo, valor);
    }
  }

  private formatarTelefone(telefone: string): string {
    return telefone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2$3-$4');
  }

  private async definirValorCampo(
    formulario: Locator,
    seletor: string,
    valor = ''
  ): Promise<void> {
    await this.definirValor(formulario.locator(seletor), valor);
  }

  private async definirValor(campo: Locator, valor: string): Promise<void> {
    await campo.evaluate((elemento, valorCampo) => {
      const campoFormulario = elemento as
        | HTMLInputElement
        | HTMLTextAreaElement;

      campoFormulario.value = valorCampo;
      campoFormulario.dispatchEvent(new Event('input', { bubbles: true }));
      campoFormulario.dispatchEvent(new Event('change', { bubbles: true }));
    }, valor);
  }

  private async ativarAbaPorDom(
    idAba: string | null,
    idPainel: string
  ): Promise<void> {
    await this.page.evaluate(
      ({ idAba, idPainel }) => {
        const painel = document.getElementById(idPainel);
        const aba = idAba ? document.getElementById(idAba) : null;
        const container = painel?.parentElement;
        const listaAbas = aba?.parentElement;

        container
          ?.querySelectorAll('[role="tabpanel"]')
          .forEach(elemento => elemento.classList.remove('e-active'));
        listaAbas
          ?.querySelectorAll('button.e-n-tab-title')
          .forEach(elemento => {
            elemento.setAttribute('aria-selected', 'false');
            elemento.setAttribute('tabindex', '-1');
          });

        painel?.classList.add('e-active');
        aba?.setAttribute('aria-selected', 'true');
        aba?.setAttribute('tabindex', '0');
      },
      { idAba, idPainel }
    );
  }
}
