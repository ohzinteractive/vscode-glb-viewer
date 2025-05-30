import { WebGLRenderer } from 'three';

export class Renderer
{
  constructor(DOMContainer)
  {
    this.container_size = { width: 1, height: 1 };
    this.DOMContainer = DOMContainer;

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(1, 1);
    DOMContainer.appendChild(this.renderer.domElement);

    this.resize_observer = new ResizeObserver((entries) =>
    {
      entries.forEach((entry) =>
      {
        const bounds = entry.contentRect;
        this.resize_if_needed(bounds);
      });
    });

    this.resize_observer.observe(DOMContainer);
  }

  render(scene, camera)
  {
    camera.aspect = this.container_size.width / this.container_size.height;
    camera.updateProjectionMatrix();

    this.renderer.setClearColor(camera.clear_color);
    this.renderer.setClearAlpha(camera.clear_alpha);

    this.renderer.render(scene, camera);
  }

  resize_if_needed(bounds)
  {
    if (this.container_size.width  !== Math.round(bounds.width) ||
        this.container_size.height !== Math.round(bounds.height))
    {
      const width = Math.round(bounds.width);
      const height = Math.round(bounds.height);

      this.container_size.width = width;
      this.container_size.height = height;
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      // console.log('RESIZING', width, height, window.devicePixelRatio);
    }
  }

  dispose()
  {
    this.renderer.dispose();
    this.DOMContainer.removeChild(this.renderer.domElement);
  }

  compile_texture(tex)
  {
    this.renderer.initTexture(tex);
  }
}
