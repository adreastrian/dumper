/**
 * Temp File Manager - Creates temporary PHP files for the dump server
 */

import { writeFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

export class TempFileManager {
  private tempFiles: Set<string> = new Set();

  /**
   * Create a temporary PHP file for the dump server
   */
  createDumpServerScript(host: string, port: number): string {
    const tempDir = tmpdir();
    const scriptPath = join(tempDir, `symfony-dump-server-${Date.now()}.php`);

    const vendorPath =
      process.env.PHP_VENDOR_PATH || join(process.cwd(), "vendor");
    const primaryAutoload = join(vendorPath, "autoload.php").replace(
      /\\/g,
      "/"
    );

    const serverCode = `<?php
// Symfony Dump Server - HTML forwarding script

require_once '${primaryAutoload}';

use Symfony\\Component\\VarDumper\\Server\\DumpServer;
use Symfony\\Component\\VarDumper\\Dumper\\HtmlDumper;

$host = '${host}:${port}';
$server = new DumpServer($host);

$dumper = new HtmlDumper();
$separator = "\n<!-- __DUMP_SEPARATOR__ -->\n";

$server->listen(function ($data, $context, $clientId) use ($dumper, $separator) {
    ob_start();
    
    if (isset($context['source'])) {
        $source = $context['source'];
        $file = $source['file'] ?? 'unknown';
        $line = $source['line'] ?? 0;
        
        $displayFile = basename($file);
        $sourceInfo = $displayFile . ' on line ' . $line;
        
        if ($sourceInfo) {
            echo '<!-- SOURCE_INFO: ' . htmlspecialchars($sourceInfo) . ' -->';
        }
    }
    
    $dumper->dump($data);
    $html = ob_get_clean();
    echo $html, $separator;
    flush();
});
`;

    writeFileSync(scriptPath, serverCode);
    this.tempFiles.add(scriptPath);

    return scriptPath;
  }

  /**
   * Create a PHP helper file for easy integration
   */
  createPhpHelper(port: number = 9912): string {
    const tempDir = tmpdir();
    const helperPath = join(tempDir, "dump-viewer-helper.php");
    const vendorPath =
      process.env.PHP_VENDOR_PATH || join(process.cwd(), "vendor");
    const primaryAutoload = join(vendorPath, "autoload.php").replace(
      /\\/g,
      "/"
    );

    const helperCode = `<?php
/**
 * Symfony Dump Viewer - PHP Helper
 * Include this file in your PHP project to start sending dumps to the viewer
 */

require_once '${primaryAutoload}';

use Symfony\Component\VarDumper\VarDumper;
use Symfony\Component\VarDumper\Cloner\VarCloner;
use Symfony\Component\VarDumper\Dumper\ServerDumper;
use Symfony\Component\VarDumper\Dumper\CliDumper;
use Symfony\Component\VarDumper\Dumper\ContextProvider\SourceContextProvider;

VarDumper::setHandler(function ($var) {
    static $dumper = null;
    static $cloner = null;
    if ($cloner === null) { $cloner = new VarCloner(); }
    if ($dumper === null) {
        $host = 'tcp://127.0.0.1:${port}';
        $dumper = new ServerDumper($host, new CliDumper(), [ 'source' => new SourceContextProvider('utf-8', getcwd()) ]);
    }
    $data = $cloner->cloneVar($var);
    $dumper->dump($data);
});
`;

    writeFileSync(helperPath, helperCode);
    this.tempFiles.add(helperPath);

    return helperPath;
  }

  /**
   * Clean up all temporary files
   */
  cleanup(): void {
    for (const filePath of this.tempFiles) {
      try {
        if (existsSync(filePath)) {
          unlinkSync(filePath);
        }
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    this.tempFiles.clear();
  }

  /**
   * Get the path to the PHP helper file
   */
  getPhpHelperPath(port: number = 9912): string {
    return this.createPhpHelper(port);
  }
}
