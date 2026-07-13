import {
  Callout,
  CodeBlock,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function InstallationAndBuild() {
  return (
    <LessonArticle>
      <LessonSection title="Choose your install path">
        <p className="text-slate-300">
          llama.cpp ships as prebuilt binaries, package-manager installs, or source builds. For learning,
          start with a <strong className="text-white">prebuilt release</strong> — compile from source only when
          you need a specific backend (CUDA version, ROCm) or the latest commit.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Prebuilt binaries</strong> — fastest; download from GitHub Releases.
          </li>
          <li>
            <strong className="text-white">Homebrew (macOS)</strong> —{' '}
            <code className="font-mono text-sm">brew install llama.cpp</code>
          </li>
          <li>
            <strong className="text-white">CMake from source</strong> — full control over GPU backends.
          </li>
          <li>
            <strong className="text-white">Docker</strong> — reproducible Linux environment with CUDA baked in.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Prebuilt binaries — zero compile">
        <p className="text-slate-300">
          Go to the{' '}
          <a href="https://github.com/ggerganov/llama.cpp/releases" className="text-genai-400 hover:underline">
            llama.cpp Releases
          </a>{' '}
          page and download the archive for your OS (Windows x64, macOS ARM/x64, Linux). Extract and run{' '}
          <code className="font-mono text-sm">llama-cli</code> directly.
        </p>
        <CodeBlock title="Verify a prebuilt binary">{`# Linux / macOS
chmod +x llama-cli
./llama-cli --version

# Windows (PowerShell)
.\\llama-cli.exe --version`}</CodeBlock>
        <Callout variant="tip">
          Prebuilt Windows CUDA builds bundle a specific CUDA version. If you get DLL errors, either install the
          matching CUDA runtime or build from source against your driver.
        </Callout>
      </LessonSection>

      <LessonSection title="Build from source with CMake">
        <p className="text-slate-300">
          Source builds let you enable CUDA, Metal, Vulkan, or BLAS acceleration. You need a C++ compiler,
          CMake 3.14+, and optionally the CUDA toolkit for NVIDIA GPUs.
        </p>
        <Example title="Linux / macOS — CPU + optional CUDA">{`git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp

# CPU-only build
cmake -B build
cmake --build build --config Release -j

# NVIDIA GPU (CUDA)
cmake -B build -DGGML_CUDA=ON
cmake --build build --config Release -j

# Binaries land in build/bin/
./build/bin/llama-cli --version`}</Example>
        <CodeBlock title="Apple Silicon — Metal acceleration">{`cmake -B build -DGGML_METAL=ON
cmake --build build --config Release -j`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Platform-specific shortcuts">
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Platform</th>
                <th className="px-4 py-3">Recommended install</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['macOS (Apple Silicon)', 'brew install llama.cpp  OR  cmake -DGGML_METAL=ON'],
                ['macOS (Intel)', 'brew install llama.cpp  OR  prebuilt release'],
                ['Windows', 'Prebuilt release or cmake -B build -G "Visual Studio 17 2022"'],
                ['Linux + NVIDIA', 'cmake -DGGML_CUDA=ON or Docker image with CUDA'],
                ['Linux CPU only', 'apt install build-essential cmake && cmake -B build'],
              ].map(([platform, method]) => (
                <tr key={platform} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{platform}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock title="Windows — Visual Studio build">{`git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
cmake -B build -G "Visual Studio 17 2022" -DGGML_CUDA=ON
cmake --build build --config Release -j`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Docker — isolated GPU environment">
        <p className="text-slate-300">
          Official and community Docker images ship llama.cpp with CUDA preconfigured. Useful when your host
          compiler chain is messy or you want identical deploy artifacts.
        </p>
        <CodeBlock title="Run with NVIDIA Container Toolkit">{`docker run --gpus all -v /path/to/models:/models \\
  -p 8080:8080 ghcr.io/ggerganov/llama.cpp:server-cuda \\
  -m /models/model.gguf --host 0.0.0.0 --port 8080`}</CodeBlock>
        <Callout variant="beginner">
          Mount your GGUF files into <code className="font-mono text-sm">/models</code> with{' '}
          <code className="font-mono text-sm">-v</code>. The image does not include model weights — download
          separately from Hugging Face.
        </Callout>
      </LessonSection>

      <LessonSection title="Common build errors and fixes">
        <ContentStep number={1} title="CUDA not found">
          <p className="text-slate-300">
            CMake reports <code className="font-mono text-sm">Could NOT find CUDA</code>.
          </p>
          <CodeBlock title="Fix">{`# Install CUDA toolkit matching your driver
nvidia-smi   # check driver version
# Set CUDA path explicitly if needed:
cmake -B build -DGGML_CUDA=ON -DCMAKE_CUDA_COMPILER=/usr/local/cuda/bin/nvcc`}</CodeBlock>
        </ContentStep>

        <ContentStep number={2} title="Compiler too old">
          <p className="text-slate-300">
            Errors about C++17 or <code className="font-mono text-sm">std::filesystem</code>.
          </p>
          <CodeBlock title="Fix">{`# Ubuntu: install a modern GCC
sudo apt install build-essential g++-12
export CXX=g++-12
cmake -B build && cmake --build build -j`}</CodeBlock>
        </ContentStep>

        <ContentStep number={3} title="Metal build fails on Intel Mac">
          <p className="text-slate-300">
            <code className="font-mono text-sm">GGML_METAL</code> is for Apple Silicon only. Use a CPU build on
            Intel Macs or install via Homebrew.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Runtime: no GPU offload">
          <p className="text-slate-300">
            Model runs but <code className="font-mono text-sm">-ngl</code> has no effect — you built CPU-only.
            Rebuild with <code className="font-mono text-sm">-DGGML_CUDA=ON</code> or{' '}
            <code className="font-mono text-sm">-DGGML_METAL=ON</code> and confirm with log output at startup.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Start with GitHub prebuilt releases or brew install llama.cpp before compiling from source.',
          'Enable GGML_CUDA (NVIDIA), GGML_METAL (Apple Silicon), or Vulkan via CMake flags.',
          'Docker gives a reproducible CUDA server environment — mount GGUF models as a volume.',
          'Most build failures are missing CUDA toolkit, old compiler, or wrong GPU backend flag.',
        ]}
      />
    </LessonArticle>
  )
}
