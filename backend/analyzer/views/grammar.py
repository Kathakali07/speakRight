'''from django.http import JsonResponse
from analyzer.grammar_corrector.util import grammar_corrector

def grammar_view(request):
    sample_text = "This is an example with bad grammer."
    result = check_grammar(sample_text)
    return JsonResponse(result)'''